import { InfoCircledIcon } from '@radix-ui/react-icons';
import './errormessage.css';
const ErrorMessage = ({ message }) => {
    return (
        <div className="error-message">
            <InfoCircledIcon size={18}/>
            <p>{message}</p>
        </div>
    );
};

export default ErrorMessage;