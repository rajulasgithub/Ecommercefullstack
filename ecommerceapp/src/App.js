import logo from './logo.svg';
import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Signup from './Components/Signup';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Components/Login';
import Companysignup from './Components/Companysignup';
import Header from './Components/Header';
import Addproduct from './Components/Addproduct';

function App() {
  return (
    <div>
      <Header/>
      <BrowserRouter>
      <Routes>
        <Route path='/signup' element={<Signup/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/companysignup' element={<Companysignup/>} />
        <Route path='/addproduct' element={<Addproduct/>} />



      </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
