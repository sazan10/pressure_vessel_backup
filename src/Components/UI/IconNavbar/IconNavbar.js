import React, { Component } from 'react';
import * as data from '../../../JSONFiles/IconNavbar.json';
import classes from './IconNavbar.css';
import {Link} from 'react-router-dom';
class IconNavBar extends Component {

    render() {
        const menu = data.default.Icons.map(d => (
            <div key={d.id} className={classes.icons}>
                <Link to={"/builder/hello"} key={d.id}><img src="https://img.icons8.com/material/24/000000/save.png" className={classes.iconsI} alt="hello" /></Link>
            </div>
        )
        );
        return (
            <div>
                {menu}
                <hr className={classes.iconsII}/>
            </div>);
    }
}

export default IconNavBar;