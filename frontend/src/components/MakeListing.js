import {Link} from 'react-router-dom'
import Button from 'react-bootstrap/Button';

function MakeListing(){
    return (
        <Link to="/NewListing"><Button>Sell</Button></Link>
    )
}

export default MakeListing