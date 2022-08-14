import numeral from "numeral";

const filters = {
    DollarFilter: value => 
    value ? numeral(value).format('($0.00a)') : '$ 0'
}

export default filters;