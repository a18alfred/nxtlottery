import React from 'react';
import { Switch, Route } from 'react-router-dom';
import styled from 'styled-components';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import Home from './pages/Home';
import Results from './pages/Results';
import Tickets from './pages/Tickets';
import NoMatch from './pages/NoMatch';
import LotteryTicketShop from './pages/LotteryTicketShop';
import PrivateRoute from './components/PrivateRoute';
import AdminPanel from './pages/AdminPanel';
import Footer from './components/Footer';
import ContractError from './pages/ContractError';
import Lotteries from './pages/Lotteries';
import IosInstallGuide from './pages/IosInstallGuide';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-feature-settings: 'ss01' on, 'ss02' on, 'cv01' on, 'cv03' on;
`;

const PageContainer = styled.div`
  display: flex;
  justify-content: start;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin-right: auto;
  margin-left: auto;
  padding: 1rem 2rem;
  z-index: 1;
  font-weight: 500;
  font-size: 1rem;

  @media screen and (max-width: 880px) {
    padding: 1rem 1rem;
  }
`;

function App() {
	return (
		<AppContainer>
			<ScrollToTop>
				<Header />
				<PageContainer>
					<Switch>
						<Route path='/' exact>
							<Home />
						</Route>
						<Route exact path='/lotteries'>
							<Lotteries />
						</Route>
						<Route path='/lotteries/:lotteryName/buy'>
							<LotteryTicketShop />
						</Route>
						<Route path='/results'>
							<Results />
						</Route>
						<Route path='/tickets'>
							<Tickets />
						</Route>
						<PrivateRoute path='/admin'>
							<AdminPanel />
						</PrivateRoute>
						<Route path='/install'>
							<IosInstallGuide />
						</Route>
						<Route path='/contract-error'>
							<ContractError />
						</Route>
						<Route path='*'>
							<NoMatch />
						</Route>
					</Switch>
				</PageContainer>
				<Footer />
			</ScrollToTop>
		</AppContainer>
	)
		;
}

export default App;
