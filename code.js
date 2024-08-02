let setx_result = null;
const prefixes = ['setx'];
const values = {
    'hdg': ['K:HEADING_BUG_SET', 'degrees', 1],
    'alt': ['A:AUTOPILOT ALTITUDE LOCK VAR', 'ft', 1],
    'com1': ['K:COM_STBY_RADIO_SET_HZ', 'MHz', 1000000],
    'nav1': ['K:NAV1_STBY_SET_HZ', 'MHz', 1000000],
    'vor1': ['K:VOR1_SET', 'degrees', 1],
    'qnhm': ['K:KOHLSMAN_SET', 'millibar', 16],
    'qnhi': ['K:KOHLSMAN_SET', 'in/hg', 33.8639 * 16],
};

search(prefixes, (query, callback) => {
    keys = Object.keys(values).join('|'); // format keys to list
    setx_result = {
        uid: 'setx_result_uid',
        label: 'SETX &lt;field&gt; &lt;new value&gt;',
        subtext: keys,
        execute: null
    };

    // test if any query is given
    if (!query) { callback([setx_result]); return; }
    
    // test if query has 
    let data = query.toLowerCase().split(' ');
    if (data.length == 1 || (data[1] != '' && !(data[1] in values)) || !(data[2])) {
        callback([setx_result]);
        return;
    }

    let value = values[data[1]];
    if ((isNaN(data[2]) || data[2] == '')) {
        setx_result.label = 'SETX ' + data[1] + ' &lt;new value&gt; ' + value[1];
        setx_result.subtext = 'Invalid new value';
        callback([setx_result]);
        return;
    } 

    let newValue = parseFloat(data[2]);
    setx_result = {
        uid: 'setx_result_uid',
        label: 'SETX ' + data[1] + ' ' + newValue + ' ' + value[1],
        subtext: '',
        execute: () => {
            let value = values[data[1]];
            this.$api.variables.set(value[0], value[1], newValue * value[2]);
            return true;
        }
    };
    
    callback([setx_result]);
});
