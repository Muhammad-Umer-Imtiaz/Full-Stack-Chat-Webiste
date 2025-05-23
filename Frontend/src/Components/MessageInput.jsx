import React, { useState } from 'react';
import { Image, Send, X } from 'lucide-react';
import { useChatStore } from '../store/useChatStore';
import toast from 'react-hot-toast';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    // Create preview URLs for selected images
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    setImages([...images, ...files]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    setImages(newImages);
    setPreviewUrls(newPreviewUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() && images.length === 0) return;

    const formData = new FormData();
    formData.append('message', message);
    images.forEach(image => {
      formData.append('image', image);
    });

    try {
      await sendMessage(formData);
      setMessage('');
      setImages([]);
      setPreviewUrls([]);
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 text-black bg-white">
      {/* Image Previews */}
      {previewUrls.length > 0 && (
        <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
          {previewUrls.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="h-20 w-20 object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 
                         hover:bg-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Message Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        {/* Image Upload Button */}
        <label className="cursor-pointer text-black hover:bg-gray-100 p-2 rounded-full transition-colors">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            disabled={images.length >= 5}
          />
          <Image
            size={24}
            className={`${images.length >= 5 ? 'text-gray-400' : 'text-blue-500'}`}
          />
        </label>

        {/* Text Input */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none 
                   focus:border-blue-500 transition-colors"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!message.trim() && images.length === 0}
          className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 
                   transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={24} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;