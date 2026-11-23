import React from 'react';
import {
  MusicalNoteIcon,
  RadioIcon,
  ShoppingBagIcon,
  CubeIcon,
  BoltIcon,
  StarIcon,
  SparklesIcon,
  GlobeAltIcon,
  FireIcon,
  TagIcon,
} from '@heroicons/react/24/outline';

export function ProductIcon({ name, category, className = '' }) {
  let IconComponent;

  switch (name) {
    case 'disc':
    case '🌌':
      IconComponent = MusicalNoteIcon;
      break;
    case 'cube':
    case '👾':
      IconComponent = CubeIcon;
      break;
    case 'globe':
    case '🌊':
      IconComponent = GlobeAltIcon;
      break;
    case 'cassette':
    case '📼':
      IconComponent = RadioIcon;
      break;
    case 'apparel':
    case '👕':
      IconComponent = ShoppingBagIcon;
      break;
    case 'bolt':
    case '⚡':
      IconComponent = BoltIcon;
      break;
    case 'star':
    case '💎':
      IconComponent = StarIcon;
      break;
    case 'sparkles':
    case '✨':
      IconComponent = SparklesIcon;
      break;
    case 'fire':
    case '🎸':
      IconComponent = FireIcon;
      break;
    case 'tag':
      IconComponent = TagIcon;
      break;
    default:
      if (category === 'Vinyl') IconComponent = MusicalNoteIcon;
      else if (category === 'Cassette') IconComponent = RadioIcon;
      else if (category === 'Apparel') IconComponent = ShoppingBagIcon;
      else if (category === 'Collectible') IconComponent = StarIcon;
      else IconComponent = SparklesIcon;
      break;
  }

  return <IconComponent className={className} aria-hidden="true" />;
}

export default ProductIcon;
