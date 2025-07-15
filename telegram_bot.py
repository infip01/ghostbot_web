import requests
import time
import threading
from queue import Queue, Empty
import logging
from typing import Dict, Any, Optional
import json

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class TelegramBot:
    def __init__(self, bot_token: str, group_id: str):
        """
        Initialize Telegram bot with token and group ID.
        
        Args:
            bot_token: Telegram bot token
            group_id: Telegram group/chat ID to send messages to
        """
        self.bot_token = bot_token
        self.group_id = group_id
        self.base_url = f"https://api.telegram.org/bot{bot_token}"
        
        # Queue for managing image sending
        self.send_queue = Queue()
        self.retry_queue = Queue()
        
        # Start worker threads
        self.running = True
        self.worker_thread = threading.Thread(target=self._worker, daemon=True)
        self.retry_thread = threading.Thread(target=self._retry_worker, daemon=True)
        
        self.worker_thread.start()
        self.retry_thread.start()
        
        logger.info("Telegram bot initialized and worker threads started")
    
    def _worker(self):
        """Main worker thread to process the send queue."""
        while self.running:
            try:
                # Get item from queue with timeout
                item = self.send_queue.get(timeout=1)
                
                if item is None:  # Shutdown signal
                    break
                
                success = False
                if item.get('type') == 'media_group':
                    # Handle media group
                    success = self._send_media_group(item['images_data'])
                else:
                    # Handle single image
                    success = self._send_image_with_caption(
                        item['image_url'],
                        item['caption'],
                        item['model_name']
                    )
                
                if not success:
                    # Add to retry queue if failed
                    item['retry_count'] = item.get('retry_count', 0) + 1
                    if item['retry_count'] <= 3:  # Max 3 retries
                        logger.info(f"Adding failed item to retry queue (attempt {item['retry_count']})")
                        self.retry_queue.put(item)
                    else:
                        if item.get('type') == 'media_group':
                            logger.error(f"Max retries exceeded for media group with {len(item['images_data'])} images")
                        else:
                            logger.error(f"Max retries exceeded for image: {item['image_url']}")
                
                self.send_queue.task_done()
                
            except Empty:
                continue
            except Exception as e:
                logger.error(f"Error in worker thread: {e}")
    
    def _retry_worker(self):
        """Retry worker thread to handle failed sends with delay."""
        while self.running:
            try:
                # Get item from retry queue with timeout
                item = self.retry_queue.get(timeout=1)
                
                if item is None:  # Shutdown signal
                    break
                
                # Wait 30 seconds before retry
                logger.info(f"Waiting 30 seconds before retry attempt {item['retry_count']}")
                time.sleep(30)
                
                success = False
                if item.get('type') == 'media_group':
                    # Handle media group retry
                    success = self._send_media_group(item['images_data'])
                else:
                    # Handle single image retry
                    success = self._send_image_with_caption(
                        item['image_url'],
                        item['caption'],
                        item['model_name']
                    )
                
                if not success:
                    # Add back to retry queue if still failing
                    item['retry_count'] = item.get('retry_count', 0) + 1
                    if item['retry_count'] <= 3:
                        logger.info(f"Retry failed, adding back to retry queue (attempt {item['retry_count']})")
                        self.retry_queue.put(item)
                    else:
                        logger.error(f"Max retries exceeded for image: {item['image_url']}")
                
                self.retry_queue.task_done()
                
            except Empty:
                continue
            except Exception as e:
                logger.error(f"Error in retry worker thread: {e}")
    
    def _send_image_with_caption(self, image_url: str, caption: str, model_name: str) -> bool:
        """
        Send image with caption to Telegram group.
        
        Args:
            image_url: URL of the image to send
            caption: Caption text for the image
            model_name: Name of the model used to generate the image
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            # Download image first
            logger.info(f"Downloading image from: {image_url}")
            image_response = requests.get(image_url, timeout=30)
            image_response.raise_for_status()
            
            # Prepare caption with source info
            full_caption = f"{caption}\n\nSource: Web ({model_name})"
            
            # Telegram caption limit is 1024 characters
            if len(full_caption) > 1024:
                # Send caption as separate message first
                self._send_text_message(full_caption)
                # Send image without caption
                full_caption = ""
            
            # Prepare the request to Telegram API
            url = f"{self.base_url}/sendPhoto"
            
            files = {
                'photo': ('image.jpg', image_response.content, 'image/jpeg')
            }
            
            data = {
                'chat_id': self.group_id,
                'parse_mode': 'HTML'  # Enable HTML formatting if needed
            }
            
            # Only add caption if it's not empty and within limit
            if full_caption:
                data['caption'] = full_caption
            
            logger.info(f"Sending image to Telegram group {self.group_id}")
            response = requests.post(url, files=files, data=data, timeout=60)
            response.raise_for_status()
            
            result = response.json()
            if result.get('ok'):
                logger.info("Image sent successfully to Telegram")
                return True
            else:
                logger.error(f"Telegram API error: {result}")
                return False
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Network error sending image to Telegram: {e}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error sending image to Telegram: {e}")
            return False
    
    def _send_text_message(self, text: str) -> bool:
        """
        Send text message to Telegram group.
        
        Args:
            text: Text message to send
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            url = f"{self.base_url}/sendMessage"
            data = {
                'chat_id': self.group_id,
                'text': text,
                'parse_mode': 'HTML'
            }
            
            response = requests.post(url, data=data, timeout=30)
            response.raise_for_status()
            
            result = response.json()
            if result.get('ok'):
                logger.info("Text message sent successfully to Telegram")
                return True
            else:
                logger.error(f"Telegram API error sending text: {result}")
                return False
                
        except Exception as e:
            logger.error(f"Error sending text message to Telegram: {e}")
            return False
    
    def _send_media_group(self, images_data: list) -> bool:
        """
        Send multiple images as a media group to Telegram.
        
        Args:
            images_data: List of dictionaries with image data
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            # Download all images first
            media_files = []
            files_dict = {}
            
            for i, image_data in enumerate(images_data):
                logger.info(f"Downloading image {i+1}/{len(images_data)} from: {image_data['image_url']}")
                image_response = requests.get(image_data['image_url'], timeout=30)
                image_response.raise_for_status()
                
                file_key = f"photo{i}"
                files_dict[file_key] = ('image.jpg', image_response.content, 'image/jpeg')
                
                media_item = {
                    'type': 'photo',
                    'media': f'attach://{file_key}'
                }
                
                # Add caption only to the first image
                if i == 0:
                    caption = f"{image_data['caption']}\n\nSource: Web ({image_data['model_name']})"
                    if len(caption) <= 1024:
                        media_item['caption'] = caption
                
                media_files.append(media_item)
            
            # If caption is too long, send it as separate message first
            if len(images_data) > 0:
                first_caption = f"{images_data[0]['caption']}\n\nSource: Web ({images_data[0]['model_name']})"
                if len(first_caption) > 1024:
                    self._send_text_message(first_caption)
                    # Remove caption from media group
                    if media_files and 'caption' in media_files[0]:
                        del media_files[0]['caption']
            
            # Prepare the request to Telegram API
            url = f"{self.base_url}/sendMediaGroup"
            
            data = {
                'chat_id': self.group_id,
                'media': json.dumps(media_files)
            }
            
            logger.info(f"Sending media group with {len(images_data)} images to Telegram group {self.group_id}")
            response = requests.post(url, files=files_dict, data=data, timeout=120)
            response.raise_for_status()
            
            result = response.json()
            if result.get('ok'):
                logger.info("Media group sent successfully to Telegram")
                return True
            else:
                logger.error(f"Telegram API error sending media group: {result}")
                return False
                
        except Exception as e:
            logger.error(f"Error sending media group to Telegram: {e}")
            return False
    
    def queue_image(self, image_url: str, caption: str, model_name: str):
        """
        Add image to the sending queue.
        
        Args:
            image_url: URL of the image to send
            caption: Caption text for the image
            model_name: Name of the model used to generate the image
        """
        item = {
            'image_url': image_url,
            'caption': caption,
            'model_name': model_name,
            'retry_count': 0
        }
        
        self.send_queue.put(item)
        logger.info(f"Image queued for sending. Queue size: {self.send_queue.qsize()}")
    
    def queue_multiple_images(self, images_data: list):
        """
        Add multiple images to the sending queue.
        
        Args:
            images_data: List of dictionaries with 'image_url', 'caption', and 'model_name' keys
        """
        for image_data in images_data:
            self.queue_image(
                image_data['image_url'],
                image_data['caption'],
                image_data['model_name']
            )
    
    def queue_media_group(self, images_data: list):
        """
        Add media group to the sending queue.
        
        Args:
            images_data: List of dictionaries with 'image_url', 'caption', and 'model_name' keys
        """
        item = {
            'type': 'media_group',
            'images_data': images_data,
            'retry_count': 0
        }
        
        self.send_queue.put(item)
        logger.info(f"Media group with {len(images_data)} images queued for sending. Queue size: {self.send_queue.qsize()}")
    
    def get_queue_status(self) -> Dict[str, int]:
        """
        Get current queue status.
        
        Returns:
            dict: Dictionary with queue sizes
        """
        return {
            'send_queue_size': self.send_queue.qsize(),
            'retry_queue_size': self.retry_queue.qsize()
        }
    
    def test_connection(self) -> bool:
        """
        Test the bot connection by getting bot info.
        
        Returns:
            bool: True if connection is successful, False otherwise
        """
        try:
            url = f"{self.base_url}/getMe"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            result = response.json()
            if result.get('ok'):
                bot_info = result.get('result', {})
                logger.info(f"Bot connection successful. Bot name: {bot_info.get('first_name', 'Unknown')}")
                return True
            else:
                logger.error(f"Bot connection failed: {result}")
                return False
                
        except Exception as e:
            logger.error(f"Error testing bot connection: {e}")
            return False
    
    def shutdown(self):
        """Gracefully shutdown the bot workers."""
        logger.info("Shutting down Telegram bot...")
        self.running = False
        
        # Send shutdown signals
        self.send_queue.put(None)
        self.retry_queue.put(None)
        
        # Wait for threads to finish
        self.worker_thread.join(timeout=5)
        self.retry_thread.join(timeout=5)
        
        logger.info("Telegram bot shutdown complete")


# Global bot instance
telegram_bot = None

def initialize_telegram_bot(bot_token: str, group_id: str) -> TelegramBot:
    """
    Initialize the global Telegram bot instance.
    
    Args:
        bot_token: Telegram bot token
        group_id: Telegram group/chat ID
        
    Returns:
        TelegramBot: The initialized bot instance
    """
    global telegram_bot
    telegram_bot = TelegramBot(bot_token, group_id)
    
    # Test connection
    if telegram_bot.test_connection():
        logger.info("Telegram bot initialized successfully")
    else:
        logger.warning("Telegram bot initialized but connection test failed")
    
    return telegram_bot

def get_telegram_bot() -> Optional[TelegramBot]:
    """
    Get the global Telegram bot instance.
    
    Returns:
        TelegramBot or None: The bot instance if initialized, None otherwise
    """
    return telegram_bot

def send_generated_images(image_urls: list, prompt: str, model_name: str, seeds_used: list = None):
    """
    Convenience function to send generated images to Telegram.
    Uses media groups for multiple images, individual messages for single images.
    
    Args:
        image_urls: List of image URLs
        prompt: The prompt used to generate the images
        model_name: Name of the model used
        seeds_used: List of seeds used (optional)
    """
    bot = get_telegram_bot()
    if not bot:
        logger.error("Telegram bot not initialized")
        return
    
    if len(image_urls) == 1:
        # Single image - send normally
        caption = prompt
        if seeds_used and len(seeds_used) > 0:
            caption += f"\n\nSeed: {seeds_used[0]}"
        
        bot.queue_image(image_urls[0], caption, model_name)
    else:
        # Multiple images - send as media group
        images_data = []
        for i, image_url in enumerate(image_urls):
            caption = prompt
            if seeds_used and i < len(seeds_used):
                caption += f"\n\nSeed: {seeds_used[i]}"
            
            images_data.append({
                'image_url': image_url,
                'caption': caption,
                'model_name': model_name
            })
        
        # Queue media group for sending
        bot.queue_media_group(images_data)

if __name__ == "__main__":
    # Test the bot (for development purposes)
    BOT_TOKEN = "8075529195:AAEIsCBp74oJG2ooIrx8k4B0NHGHqI4tggs"
    GROUP_ID = "-1002502277172"
    
    bot = initialize_telegram_bot(BOT_TOKEN, GROUP_ID)
    
    # Test with a sample image
    test_image_url = "https://example.com/test.jpg"
    test_caption = "Test image generation"
    test_model = "test-model"
    
    bot.queue_image(test_image_url, test_caption, test_model)
    
    # Keep the script running for testing
    try:
        while True:
            status = bot.get_queue_status()
            print(f"Queue status: {status}")
            time.sleep(10)
    except KeyboardInterrupt:
        bot.shutdown()