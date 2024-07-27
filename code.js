let law_result = null;
const prefixes = ['setx'];
const values = {
    'hdg': ['K:HEADING_BUG_SET', 'degrees'],
    'alt': ['A:AUTOPILOT ALTITUDE LOCK VAR', 'ft']
};

search(prefixes, (query, callback) => {    
    law_result = {
        uid: 'law_result_uid',
        label: 'SETX &lt;HDG|ALT&gt; &lt;new value&gt;',
        subtext: '',
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

    if (data.length <= 3 && (isNaN(data[2]) || data[2] == '')) {
        law_result.label = 'SETX HDG &lt;new value&gt;'
        law_result.subtext = 'Invalid new value';
        callback([law_result]);
        return;
    } 

    let newValue = parseFloat(data[2]);

    law_result = {
        uid: 'law_result_uid',
        label: 'SETX ' + data[1] + ' ' + newValue,
        subtext: '',
        execute: () => {
            // console.log(newValue);
            let value = values[data[1]];
            this.$api.variables.set(value[0], value[1], newValue);
            return true;
        }
    };
    
    callback([law_result]);
});
