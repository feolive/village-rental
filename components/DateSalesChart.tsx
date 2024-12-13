'use client';

import {Line} from 'react-chartjs-2';

export default function DateSalesChart({sales}: {sales: any}) {

  const d : any = {
    datasets: [
      {
        backgroundColor: '#48CC20',
        borderColor: '#48CC20',
        borderWidth: 1,
      },
    ],
  };
  d.labels = sales?.labels;
  d.datasets[0].data = sales?.data

  return <Line className='w-3/4 h-3/4' data={d} />;
}