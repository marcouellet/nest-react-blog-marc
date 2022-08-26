import { useNavigate } from "react-router-dom";

import { useSessionContext } from '@Contexts';

type RestrictedRouteProps = React.HTMLProps<HTMLElement> & {
    children: React.ReactElement,
}

const RestrictedRoute: React.FC<RestrictedRouteProps> = ({children}) => {
    const { sessionState : { user, isAuthenticated } } = useSessionContext();
    const navigate = useNavigate();

    if (isAuthenticated) {
        // user is authenticated
        navigate('/');
    }

    return children;
}

export default RestrictedRoute;
