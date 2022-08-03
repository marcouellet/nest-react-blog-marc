import { useNavigate } from "react-router-dom";

import useContextSession from '../contexts/session.context';

type ProtectedRouteProps = React.HTMLProps<HTMLElement> & {
    children: React.ReactElement,
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {
    const { sessionState : { user, isAuthenticated } } = useContextSession();
    const navigate = useNavigate();

    if (!isAuthenticated) {
        // user is not authenticated
        navigate('/');
    }

    return children;
}

export default ProtectedRoute;
