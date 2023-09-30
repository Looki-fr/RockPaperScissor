import React, { Component } from 'react';

export default class Object extends Component {

    render() {
        // Define inline style with the random positions
        const objectStyle = {
            position: 'absolute',
            left: this.props.x + 'px',
            top: this.props.y + 'px',
            transform: 'rotate(' + (this.props.angle-Math.PI/2) + 'rad)',
        };

        if (this.props.selected){
            objectStyle.border = '2px solid #ff4444';
        }

        return (
            <div className="Object" style={objectStyle}>
                <img src={this.props.icon} className="Object-icon" alt="logo" />
            </div>
        );
    }
}

