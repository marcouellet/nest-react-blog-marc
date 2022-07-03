import { useNavigate } from "react-router-dom";
import useAuth from '../contexts/auth';

type RestrictedRouteProps = React.HTMLProps<HTMLElement> & {
    children: React.ReactElement,
}

const RestrictedRoute: React.FC<RestrictedRouteProps> = ({children}) => {
    const { state : { user, isAuthenticated } } = useAuth();
    const navigate = useNavigate();

    if (isAuthenticated) {
        // user is authenticated
        navigate('/');
    }

    return children;
}

export default RestrictedRoute;
