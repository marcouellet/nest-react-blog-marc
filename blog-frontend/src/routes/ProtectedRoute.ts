import { useNavigate } from "react-router-dom";

import { useSessionContext } from '@Contexts';

type ProtectedRouteProps = React.HTMLProps<HTMLElement> & {
    children: React.ReactElement,
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({children}) => {
    const { sessionState : { user, isAuthenticated } } = useSessionContext();
    const navigate = useNavigate();

    if (!isAuthenticated) {
        // user is not authenticated
        navigate('/');
    }

    return children;
}

export default ProtectedRoute;
