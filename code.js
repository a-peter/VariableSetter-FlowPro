let law_result = null;
const prefixes = ['setx'];
const [whole, decimal] = [0, 1];
const values = {
    'hdg': ['K:HEADING_BUG_SET', 'degrees', 1],
    'alt': ['A:AUTOPILOT ALTITUDE LOCK VAR', 'ft', 1],
    'com1': ['K:COM_STBY_RADIO_SET_HZ', 'MHz', 1000000]
};

search(prefixes, (query, callback) => {
    keys = Object.keys(values).join('|');
    law_result = {
        uid: 'law_result_uid',
        label: 'SETX &lt;field&gt; &lt;new value&gt;',
        subtext: keys,
        // is_note: true,
        execute: null
    };

    if (!query) { callback([law_result]); return; }
    
    let data = query.split(' ');
    if (data.length <= 2) {
        callback([law_result]);
        return;
    }

    if (data[1] != '' && !(data[1] in values)) {
        law_result.subtext = 'Unknown key ' + data[1];
        callback([law_result]);
        return;
    }

    let value = values[data[1]];
    if (data.length <= 3 && (isNaN(data[2]) || data[2] == '')) {
        law_result.label = 'SETX ' + data[1] + ' &lt;new value&gt; ' + value[1];
        law_result.subtext = 'Invalid new value';
        callback([law_result]);
        return;
    } 

    let newValue = parseFloat(data[2]);

    law_result = {
        uid: 'law_result_uid',
        label: 'SETX ' + data[1] + ' ' + newValue + ' ' + value[1],
        subtext: '',
        execute: () => {
            // console.log(newValue);
            let value = values[data[1]];
            this.$api.variables.set(value[0], value[1], newValue * value[2]);
            return true;
        }
    };
    
    callback([law_result]);
});
