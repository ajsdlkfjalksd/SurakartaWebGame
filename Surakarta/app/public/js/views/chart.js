
$(document).ready(function(){
    google.charts.load('current', {packages: ['corechart', 'bar']});
    google.charts.setOnLoadCallback(drawStacked);

    function drawStacked() {
        var data = google.visualization.arrayToDataTable([
            ['Username', 'Win', 'Lost'],
            ['test', 6, 4],
            ['cmr', 5, 1],
            ['3421', 5, 3],
            ['123', 2, 3],
            ['123123', 1, 8]
        ]);

        var options = {
            title: 'Top 5 Players',
            chartArea: {width: '50%'},
            isStacked: true,
            hAxis: {
                title: 'Total Plays',
                minValue: 0,
            },
            vAxis: {
                title: 'Username'
            }
        };
        var chart = new google.visualization.BarChart(document.getElementById('chart_div'));
        chart.draw(data, options);
    }

});
