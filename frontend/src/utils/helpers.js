// Utility functions for the app

// Import actual images from assets
import bananaImg from '../assets/banana.jpg';
import breadImg from '../assets/bread.jpg';
import eggImg from '../assets/egg.jpg';
import femaleImg from '../assets/female.jpg';
import female30Img from '../assets/female_30.jpg';
import fishImg from '../assets/fish.jpg';
import ladyImg from '../assets/lady.jpg';
import tomatoImg from '../assets/tomato.jpg';

// Product image mapping
const productImages = {
  banana: bananaImg,
  bread: breadImg,
  egg: eggImg,
  female: femaleImg,
  female_30: female30Img,
  fish: fishImg,
  lady: ladyImg,
  tomato: tomatoImg,
};

// Get product image by name or category
export const getProductImage = (category, productName) => {
  // Try to match by product name first
  const lowerProductName = productName.toLowerCase();
  
  if (lowerProductName.includes('banana')) return productImages.banana;
  if (lowerProductName.includes('bread')) return productImages.bread;
  if (lowerProductName.includes('egg')) return productImages.egg;
  if (lowerProductName.includes('fish')) return productImages.fish;
  if (lowerProductName.includes('tomato')) return productImages.tomato;
  
  // Fallback by category
  switch (category) {
    case 'fruits':
      return productImages.banana;
    case 'vegetables':
      return productImages.tomato;
    case 'bakery':
      return productImages.bread;
    case 'dairy':
      return productImages.egg;
    case 'protein':
      return productImages.fish;
    default:
      return productImages.banana; // Default fallback
  }
};

// Get user avatar image
export const getUserAvatar = (userType = 'default') => {
  if (userType === 'female' || userType === 'lady') {
    return Math.random() > 0.5 ? productImages.female : productImages.lady;
  }
  return productImages.female_30; // Default avatar
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Format rating stars
export const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  
  return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(5 - Math.ceil(rating));
};