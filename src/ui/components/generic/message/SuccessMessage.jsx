import { CheckCircledIcon } from '@radix-ui/react-icons';
import './successmessage.css';
const SuccessMessage = ({ message }) => {
    return (
        <div className="success-message">
            <CheckCircledIcon size={18}/>
            <p>{message}</p>
        </div>
    );
};

export default SuccessMessage;