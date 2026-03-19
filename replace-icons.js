const fs = require('fs');
let content = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

// Replace imports
content = content.replace(/import \{[\s\S]*?\} from 'lucide-react';/, \import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faThumbtack, faStar, faMagnifyingGlass, faShieldHalved, faLock, faCrown, faMessage, faHeart, faEnvelope, faChevronDown, faChevronUp, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar, faHeart as farHeart } from '@fortawesome/free-regular-svg-icons';\);

// Replace icon usages
content = content.replace(/<Trash2 /g, '<FontAwesomeIcon icon={faTrash} ');
content = content.replace(/<Pin /g, '<FontAwesomeIcon icon={faThumbtack} ');
content = content.replace(/<PinOff /g, '<FontAwesomeIcon icon={faThumbtack} ');
content = content.replace(/<Star /g, '<FontAwesomeIcon icon={faStar} ');
content = content.replace(/<StarOff /g, '<FontAwesomeIcon icon={farStar} ');
content = content.replace(/<Search /g, '<FontAwesomeIcon icon={faMagnifyingGlass} ');
content = content.replace(/<Shield /g, '<FontAwesomeIcon icon={faShieldHalved} ');
content = content.replace(/<Lock /g, '<FontAwesomeIcon icon={faLock} ');
content = content.replace(/<Crown /g, '<FontAwesomeIcon icon={faCrown} ');
content = content.replace(/<MessageSquare /g, '<FontAwesomeIcon icon={faMessage} ');
content = content.replace(/<Heart /g, '<FontAwesomeIcon icon={faHeart} ');
content = content.replace(/<HeartOff /g, '<FontAwesomeIcon icon={farHeart} ');
content = content.replace(/<Mail /g, '<FontAwesomeIcon icon={faEnvelope} ');
content = content.replace(/<ChevronDown /g, '<FontAwesomeIcon icon={faChevronDown} ');
content = content.replace(/<ChevronUp /g, '<FontAwesomeIcon icon={faChevronUp} ');
content = content.replace(/<Send /g, '<FontAwesomeIcon icon={faPaperPlane} ');

content = content.replace(/icon: Mail/g, 'icon: faEnvelope');
content = content.replace(/icon: MessageSquare/g, 'icon: faMessage');
content = content.replace(/icon: Pin/g, 'icon: faThumbtack');
content = content.replace(/icon: Heart/g, 'icon: faHeart');

content = content.replace(/<stat\.icon /g, '<FontAwesomeIcon icon={stat.icon} ');

fs.writeFileSync('src/app/dashboard/page.tsx', content);
console.log('Done replacing icons in dashboard');

