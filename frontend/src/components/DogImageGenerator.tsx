import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const DogImageGenerator: React.FC = () => {
  const [dogImage, setDogImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const generateDogImage = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://dog.ceo/api/breeds/image/random');
      const data = await response.json();
      
      if (data.status === 'success') {
        setDogImage(data.message);
      } else {
        toast.error('Failed to fetch dog image');
      }
    } catch (error) {
      console.error('Error fetching dog image:', error);
      toast.error('Something went wrong while generating dog image');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <button
        onClick={generateDogImage}
        disabled={isLoading}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {isLoading ? 'Generating...' : 'Generate Dog Image'}
      </button>
      
      {dogImage && (
        <div className="border border-indigo-600 rounded-md p-2 mt-4">
          <img src={dogImage} alt="Random Dog" className="max-w-full h-auto" />
        </div>
      )}
    </div>
  );
};

export default DogImageGenerator;