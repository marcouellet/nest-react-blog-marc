import { useNavigate } from "react-router-dom";

import useContextSession from '../contexts/session.context';

type RestrictedRouteProps = React.HTMLProps<HTMLElement> & {
    children: React.ReactElement,
}

const RestrictedRoute: React.FC<RestrictedRouteProps> = ({children}) => {
    const { sessionState : { user, isAuthenticated } } = useContextSession();
    const navigate = useNavigate();

    if (isAuthenticated) {
        // user is authenticated
        navigate('/');
    }

    return children;
}

export default RestrictedRoute;
