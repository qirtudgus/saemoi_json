import board from "../src/img/add_white.svg";
import { useNavigate } from "react-router-dom";
const AddBoard = () => {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="addBoard"
        onClick={() => {
          navigate("/write");
        }}
      >
        <img src={board} alt="addBoard"></img>
      </div>
    </>
  );
};

export default AddBoard;
