//graphs and charts
$.get(`/dashboard/gender`, (data, status) => {
    const male = data[0].male_cnt;
    const female = data[0].female_cnt;
    const xValues = ["Male", "Female"];
    const yValues = [male, female];
    const barColors = [
        "#c8e7f5",
        "#f6d2e0"
    ];

    new Chart("myChart", {
        type: "pie",
        data: {
            labels: xValues,
            datasets: [{
                backgroundColor: barColors,
                data: yValues
            }]
        },
        options: {
            title: {
                display: true,
                text: "Male Female ratio"
            }
        }
    });
});
$.get(`/dashboard/numberemp`, (data, status) => {
 if(data[0].data_2020==null){
    data[0].data_2020=0
 }  
 if(data[0].data_2021==null){
    data[0].data_2021=0
 }  
 if(data[0].data_2022==null){
    data[0].data_2022=0
 } 
 if(data[0].data_2023==null){
    data[0].data_2023=0
 } 
const x2Values = [ 2020, 2021, 2022, 2023];
const y2Values = [data[0].data_2020, data[0].data_2021, data[0].data_2022,data[0].data_2023];

new Chart("myChart2", {
    type: "line",
    data: {
        labels: x2Values,
        datasets: [{
            fill: false,
            lineTension: 0,
            backgroundColor: "#E12828",
            borderColor: "#ffcbd1",
            data: y2Values
        }]
    },
    options: {
        legend: { display: false },
        
        title: {
            display: true,
            text: "Number of employees VS Year"
        }
    }
});
});

const xValues3 = ["Subject-1", "Subject-2", "Subject-3", "Subject-4"];
const yValues3 = [55, 49, 44, 24];
const barColors3 = [
    "#b91d47",
    "#00aba9",
    "#2b5797",
    "#e8c3b9",
    "#1e7145"
];


var canvas = document.getElementById('myChart4');
new Chart(canvas, {
    type: 'line',
    data: {
        labels: ['2018', '2019', '2020', '2021', '2022'],
        datasets: [{
            label: 'Subject-1',
            yAxisID: 'A',
            backgroundColor: "#E12828",
            borderColor: "#ffcbd1",
            data: [82, 96, 84, 76, 69]
        }, {
            label: 'Subject-2',
            yAxisID: 'A',
            backgroundColor: "#79AC78",
            borderColor: "#D0E7D2",
            data: [78, 90, 90, 71, 80]
        }, {
            label: 'Subject-3',
            yAxisID: 'A',
            backgroundColor: "#D0A2F7 ",
            borderColor: "#E5D4FF",
            data: [90, 60, 70, 71, 80]
        },
        {
            label: 'Subject-4',
            yAxisID: 'A',
            backgroundColor: "#89CFF3 ",
            borderColor: "#CDF5FD",
            data: [80, 50, 70, 90, 90]
        }
        ]
    },
    options: {
        title: {
            display: true,
            text: "trainingwise Employees vs Year"
        },
        scales: {
            yAxes: [{
                id: 'A',
                type: 'linear',
            }]
        }
    }
});
$.get(`/dashboard/training-info`, (data, status) => {
    for (let x = 0; x < data.length; x++) {
        $("#training-info").append(
            "<div id='info-box'><p class='info-subject'>" + data[x].training_subject + " :<span class='info-training'> " + data[x].training + "</span>" + "</p>"
            + "<p class='info-title'>" + data[x].title_info + "</p>" +
            "<p class='info-about'>" + data[x].about_info + "</p>")
    }
});
