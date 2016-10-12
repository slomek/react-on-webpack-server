import React from 'react';

import Score from './Score';

const App = () => (
    <div className="app">
        <Score team="Poland" score={ 2 } />
        <Score team="Armenia" score={ 1 } />
    </div>
);

export default App;
