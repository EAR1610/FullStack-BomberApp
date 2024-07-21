import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { AuthContextProps } from "../../interface/Auth";

function HomePage() {

  const authContext = useContext<AuthContextProps | undefined>(AuthContext);

  if (!authContext) throw new Error("useContext(AuthContext) must be used within an AuthProvider");

  const { currentToken } = authContext;

  return (
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">Página principal de BomberApp</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos
            explicabo suscipit cum eius, iure est nulla animi consequatur
            facilis id pariatur fugit quos laudantium temporibus dolor ea
            repellat provident impedit!
          </p>          
        </div>
      </div>
    </div>
  );
}

export default HomePage;