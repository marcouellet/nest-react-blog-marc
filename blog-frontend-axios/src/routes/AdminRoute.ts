import { useNavigate } from "react-router-dom";

import useAuth from '../contexts/auth';
import { UserRole } from '../types';

type AdminRouteProps = React.HTMLProps<HTMLElement> & {
    children: React.ReactElement,
}

const AdminRoute: React.FC<AdminRouteProps> = ({children}) => {
    const { state : { user, isAuthenticated } } = useAuth();
    const navigate = useNavigate();

    const isAdministrator = () => isAuthenticated && user?.role === UserRole.ADMIN;

    if (!isAdministrator()) {
        // user has not admin role
        navigate('/');
    }

    return children;
}

export default AdminRoute;
