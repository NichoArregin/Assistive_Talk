
import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '../components/Icon';

interface AddClientPageProps {
  onAddClient: (name: string, imageUrl: string) => void;
}

const AddClientPage: React.FC<AddClientPageProps> = ({ onAddClient }) => {
  const [name, setName] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file (e.g., JPG, PNG, GIF).');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setError(''); // Clear previous errors
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Client name cannot be empty.');
      return;
    }
    if (!imagePreview) {
      setError('Please upload an image for the client.');
      return;
    }
    onAddClient(name.trim(), imagePreview);
    navigate('/');
  };

  return (
    <div className="max-w-lg mx-auto bg-slate-800 p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-100 mb-6">Add a New Client Profile</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-300 mb-2">
            Client Name
          </label>
          <input
            id="clientName"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            placeholder="Enter the client's name"
            className="w-full p-3 bg-slate-700 border border-slate-600 text-gray-100 placeholder-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            aria-describedby={error ? 'form-error' : undefined}
          />
        </div>

        <div className="mb-6">
           <label className="block text-sm font-medium text-gray-300 mb-2">
            Client Image
          </label>
          <div className="mt-2 flex items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center border-2 border-slate-600">
              {imagePreview ? (
                <img src={imagePreview} alt="Client preview" className="w-full h-full object-cover" />
              ) : (
                 <Icon name="user" className="w-12 h-12 text-slate-500" />
              )}
            </div>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
                aria-label="Upload client image"
            />
            <button
                type="button"
                onClick={triggerFileSelect}
                className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500 transition"
            >
              Upload Image
            </button>
          </div>
        </div>
        
        {error && <p id="form-error" className="text-red-400 text-sm mb-4 -mt-2">{error}</p>}

        <div className="flex items-center justify-end gap-4 mt-8">
          <Link
            to="/"
            className="px-6 py-2 bg-slate-600 text-white font-semibold rounded-lg shadow-md hover:bg-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-slate-500 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 transition"
          >
            Save Client
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClientPage;
