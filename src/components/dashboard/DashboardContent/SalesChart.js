"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Line } from "react-chartjs-2"
import { Badge } from "../../ui/badge"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js"
import { TrendingUp, ArrowUpRight, CalendarDays } from "lucide-react"

// Enregistrement des composants nécessaires pour Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

/**
 * Composant affichant le graphique des ventes avec un design moderne
 * @returns {JSX.Element} Graphique linéaire des ventes
 */
export default function SalesChart() {
  const currentRevenue = 31000
  const lastMonthRevenue = 25000
  const percentageIncrease = ((currentRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)

  // Configuration du graphique
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "end",
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          boxHeight: 6,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'white',
        titleColor: '#111827',
        bodyColor: '#111827',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            return context.dataset.label + ': ' + context.parsed.y.toLocaleString() + '€'
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.04)',
          drawBorder: false,
        },
        border: {
          display: false
        },
        ticks: {
          callback: (value) => value.toLocaleString() + '€',
          padding: 10,
          font: {
            size: 11
          }
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        border: {
          display: false
        },
        ticks: {
          padding: 10,
          font: {
            size: 11
          }
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    elements: {
      line: {
        tension: 0.3
      },
      point: {
        radius: 0,
        hoverRadius: 6
      }
    }
  }

  // Données du graphique
  const data = {
    labels: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil"],
    datasets: [
      {
        label: "2024",
        data: [12000, 19000, 16000, 25000, 20000, 28000, 31000],
        borderColor: "rgb(234, 88, 12)", // Orange
        backgroundColor: "rgba(234, 88, 12, 0.1)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "2023",
        data: [10000, 15000, 13000, 18000, 16000, 22000, 25000],
        borderColor: "rgb(22, 163, 74)", // Vert
        backgroundColor: "rgba(22, 163, 74, 0.1)",
        fill: true,
        tension: 0.4,
      }
    ]
  }

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 pb-6">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold">Évolution des Ventes</CardTitle>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            <span>Comparaison mensuelle</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100">
            <TrendingUp className="h-3.5 w-3.5 mr-1" />
            CA Mensuel: {currentRevenue.toLocaleString()} CFA
          </Badge>
          <div className="flex items-center text-sm">
            <ArrowUpRight className={`h-4 w-4 ${percentageIncrease > 0 ? 'text-green-500' : 'text-red-500'}`} />
            <span className={`${percentageIncrease > 0 ? 'text-green-700' : 'text-red-700'} font-medium`}>
              {percentageIncrease}%
            </span>
            <span className="text-muted-foreground ml-1">vs mois dernier</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] sm:h-[400px] w-full">
          <Line options={options} data={data} />
        </div>
      </CardContent>
    </Card>
  )
}
