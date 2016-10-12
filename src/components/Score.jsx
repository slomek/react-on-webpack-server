import React from 'react';

const Score = ({ team, score }) => (
    <div className="score">
        <div className="score__score">{ score }</div>
        <div className="score__team">{ team }</div>
    </div>
);

Score.propTypes = {
    team: React.PropTypes.string.isRequired,
    score: React.PropTypes.number.isRequired
};

export default Score;
