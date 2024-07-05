<script>
    import { Pie } from 'svelte-chartjs';
    import {
        collection,
        onSnapshot,
        query,
        QuerySnapshot,
        addDoc
    } from "firebase/firestore";
    import { db } from "$lib/firebase";
    import { page } from "$app/stores";
    import {
        Chart as ChartJS,
        Title,
        Tooltip,
        Legend,
        ArcElement,
        CategoryScale,
    } from 'chart.js';

    ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

    const colors = ['#004760', '#018f81', '#f49c2f', '#e93d3a', '#970e3f']
    
    export let room_id;
    export let question_id;
    let ChartData = {
        labels: [],
        datasets: [{data:[], backgroundColor: colors,},],
    }

    let q = query(collection(db, `/Rooms/${room_id}/Questions/`));
    onSnapshot(q, (snapshot) => {
        let data_s = snapshot.docs.map(doc => {
            if(doc.id == question_id){
                return doc.data();
            }
        });
        data_s = data_s.filter(item => item !== undefined);
        let rawdata = data_s[0];
        ChartData.labels = rawdata.options;
        ChartData.datasets[0].data = rawdata.results;
    });

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 18,
                    },
                },
            },
            tooltip: {
                enabled: true,
            },
        }
    };
</script>

<Pie data={ChartData} {options} />
