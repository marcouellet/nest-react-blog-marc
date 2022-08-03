import { useNavigate } from "react-router-dom";

import useContextSession from '../contexts/session.context';
import { UserRole } from '../types';

type AdminRouteProps = React.HTMLProps<HTMLElement> & {
    children: React.ReactElement,
}

const AdminRoute: React.FC<AdminRouteProps> = ({children}) => {
    const { sessionState : { user, isAuthenticated } } = useContextSession();
    const navigate = useNavigate();

    const isAdministrator = () => isAuthenticated && user?.role === UserRole.ADMIN;

    if (!isAdministrator()) {
        // user has not admin role
        navigate('/');
    }

    return children;
}

export default AdminRoute;
