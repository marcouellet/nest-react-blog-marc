import { useNavigate } from "react-router-dom";

import useAuth from '../contexts/auth';

type ProtectedRouteProps = React.HTMLProps<HTMLElement> & {
    children: React.ReactElement,
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {
    const { state : { user, isAuthenticated } } = useAuth();
    const navigate = useNavigate();

    if (!isAuthenticated) {
        // user is not authenticated
        navigate('/');
    }

    return children;
}

export default ProtectedRoute;
