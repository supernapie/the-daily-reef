// returns the number of days between now and start date
export default (start = '2024-12-03') => {
    let today = new Date().getTime();
    let startday = new Date(start).getTime();
    return Math.floor((today - startday) / 86400000);
}
