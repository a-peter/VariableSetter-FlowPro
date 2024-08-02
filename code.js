let setx_result = null;
const prefixes = ['setx'];
const variables = {
    'alt': {name: 'A:AUTOPILOT ALTITUDE LOCK VAR', unit: 'ft', factor: 1, note: 'Autopilot altitude in ft'},
    'com1': {name: 'K:COM_STBY_RADIO_SET_HZ', unit: 'MHz', factor: 1000000, note: 'COM1 standby frequency'},
    'com1a': {name: 'K:COM_RADIO_SET_HZ', unit: 'MHz', factor: 1000000, note: 'COM1 active frequency'},
    'hdg': {name: 'K:HEADING_BUG_SET', unit: 'degrees', factor: 1, note: 'Heading bug in degrees'},
    'nav1': {name: 'K:NAV1_STBY_SET_HZ', unit: 'MHz', factor: 1000000, note: 'NAV1 standby frequency'},
    'nav1a': {name: 'K:NAV1_RADIO_SET_HZ', unit: 'MHz', factor: 1000000, note: 'NAV2 standby frequency'},
    'qnhi': {name: 'K:KOHLSMAN_SET', unit: 'in/hg', factor: 33.8639 * 16, note: 'Barometric pressure in inch of mercury'},
    'qnhm': {name: 'K:KOHLSMAN_SET', unit: 'millibar', factor: 16, note: 'Barometric pressure in millibar'},
    'vor1': {name: 'K:VOR1_SET', unit: 'degrees', factor: 1, note: 'VOR1 course in degrees'},
};

search(prefixes, (query, callback) => {
    keys = Object.keys(variables).join('|'); // format keys to list
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
    if (data.length == 1 || !data[1] || (data[1] != '' && !(data[1] in variables)) ) {
        callback([setx_result]);
        return;
    }

    let variable = variables[data[1]];
    if ((isNaN(data[2]) || data[2] == '')) {
        setx_result.label = 'SETX ' + data[1] + ' &lt;new value&gt; ' + variable.unit;
        setx_result.subtext = '<p>' + variable.note + '<br>Invaild value!</p>';
        is_note = false;
        callback([setx_result]);
        return;
    } 

    let newValue = parseFloat(data[2]);
    setx_result = {
        uid: 'setx_result_uid',
        label: 'SETX ' + data[1] + ' ' + newValue + ' ' + variable.unit,
        subtext: variable.note,
        execute: () => {
            let variable = variables[data[1]];
            this.$api.variables.set(variable.name, variable.unit, newValue * variable.factor);
            return true;
        }
    };
    
    callback([setx_result]);
});
