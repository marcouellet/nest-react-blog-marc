import { useNavigate } from "react-router-dom";

import { useSessionContext } from '@Contexts';
import { UserRole } from "@blog-common/enum";

type AdminRouteProps = React.HTMLProps<HTMLElement> & {
    children: React.ReactElement,
}

const AdminRoute: React.FC<AdminRouteProps> = ({children}) => {
    const { sessionState : { user, isAuthenticated } } = useSessionContext();
    const navigate = useNavigate();

    const isAdministrator = () => isAuthenticated && user?.role === UserRole.ADMIN;

    if (!isAdministrator()) {
        // user has not admin role
        navigate('/');
    }

    return children;
}

export default AdminRoute;
