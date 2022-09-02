import { Component, createContext, useContext } from 'react';

import { UserDto } from "shared/dtos";

interface ContextValueType {
	isAuthenticated?: boolean,
	user?: UserDto | null,
	isLoading?: boolean,
	getIdToken?: (...p: any) => any,
	loginWithRedirect?: (...p: any) => any,
	logout?: (...p: any) => any
}

// create the context
const PassportContext = createContext<ContextValueType | null>(null);
export const usePassport: any = () => useContext(PassportContext);

interface IState {
	user: UserDto | null,
	isLoading: boolean,
	isAuthenticated: boolean,
}

// create a provider
export class PassportProvider extends Component<{}, IState> {
	constructor(props: any) {
		super(props)
		this.state = {
			isLoading: true,
			isAuthenticated: false,
			user: null,
		};
	}

	componentDidMount() {
		this.initializePassport();		
	}

	// initialize the passport library
	initializePassport = async () => {
        //this.setState({})
	};

	// render() {
	// 	const { isLoading, isAuthenticated, user } = this.state;
	// 	const { children } = this.props;

	// 	const configObject = {
	// 		isLoading,
	// 		isAuthenticated,
	// 		user,
    //         getIdToken: (...p: any) => "",
    //         loginWithRedirect: (...p: any) => "",
    //         logout: (...p: any) => ""
	// 	};

	// 	return <PassportContext.Provider value={configObject}>{children}</PassportContext.Provider>;
	// }
}