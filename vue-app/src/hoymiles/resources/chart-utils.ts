export const getChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--p-text-muted-color')
  const textColorSecondary = documentStyle.getPropertyValue('--p-form-field-placeholder-color')
  const surfaceBorder = documentStyle.getPropertyValue('--p-form-field-float-label-focus-color')

  return {
    plugins: {
      legend: {
        labels: {
          color: textColor
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: textColorSecondary
        },
        title: {
          display: true
        },
        grid: {
          color: surfaceBorder,
          drawBorder: false
        }
      },
      x: {
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder,
          drawBorder: false
        }
      }
    }
  }
}
