import "./App.css";
import "react-notifications/lib/notifications.css";
import { NotificationContainer } from "react-notifications";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import HomePage from "./pages/home";
import { AppDataProvider } from "./contexts/appData";

export const isDev = process.env.NODE_ENV === "development";

function App() {
  return (
    <AppDataProvider>
      <Container className="p-4 col-12">
        <HomePage />
        <NotificationContainer />
      </Container>
    </AppDataProvider>
  );
}

export default App;
