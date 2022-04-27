import { Redirect, Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Button, Dropdown, DropdownButton } from "react-bootstrap";
import { LinkContainer } from 'react-router-bootstrap'

function LoggedInName() {
  var _ud = localStorage.getItem('user_data');
  // var ud = localStorage.getItem('user_data');
  // console.log("_ud: ", _ud)
  var ud = JSON.parse(_ud);
  // var userId = ud.id;
  var firstName = ud.firstName;
  var lastName = ud.lastName;
  const doLogout = event => {
    event.preventDefault();
    // localStorage.removeItem("user_data")
    localStorage.setItem("user_data", JSON.stringify({}))
    // return <Redirect to="/"/>;
    window.location.href = '/';
  };
  return (
     <Nav>
       {/* <div><span id="userName"  style={{ color: "white" }}>Logged In As {firstName} {lastName}    </span>
    <Button variant = "outline-info" 
    onClick={doLogout}> Log Out </Button></div> */}
   
      <NavDropdown align='end' flip="true" drop="down"
        id="nav-dropdown-dark-example"
        title={firstName + " " + lastName}
        menuVariant="dark"
      // show="false"
      >
        <NavDropdown.Item as={Link} to='/UserListings' >Your Listings</NavDropdown.Item>
        <NavDropdown.Item as={Link} to='/EditProfile'>Edit Profile</NavDropdown.Item>
        <NavDropdown.Divider />
        <Nav><NavDropdown.Item as={Link} to='/' onClick={doLogout}>Logout</NavDropdown.Item></Nav>
      </NavDropdown>
    </Nav>
  );
};

export default LoggedInName;