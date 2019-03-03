const form = document.getElementById('vote-form')

form.addEventListener('submit', e => {
  e.preventDefault()
  const choice = document.querySelector('input[name=os]:checked').value
  const data = { os: choice }

  fetch('http://localhost:3000/poll', {
    method: 'post',
    body: JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err))
})

fetch('http://localhost:3000/poll')
  .then(res => res.json())
  .then(data => {
    const votes = data.votes
    const totalVotes = votes.length

    const voteCount = votes.reduce(
      (acc, vote) => ((acc[vote.os] = (acc[vote.os] || 0) + vote.points), acc),
      {}
    )

    let dataPoints = [
      { label: 'Windows', y: voteCount.Windows },
      { label: 'MacOS', y: voteCount.MacOS },
      { label: 'Linux', y: voteCount.Linux },
      { label: 'Other', y: voteCount.Other }
    ]

    const chartContainer = document.getElementById('chartContainer')

    if (chartContainer) {
      const chart = new CanvasJS.Chart('chartContainer', {
        animationEnabled: true,
        theme: 'theme1',
        title: {
          text: `Poll Results (${totalVotes})`
        },
        data: [
          {
            type: 'column',
            dataPoints
          }
        ]
      })

      chart.render()

      // Enable pusher logging - don't include this in production
      Pusher.logToConsole = true

      var pusher = new Pusher('0dedd7c16dd91941349d', {
        cluster: 'ap1',
        forceTLS: true
      })

      var channel = pusher.subscribe('os-poll')
      channel.bind('os-vote', function(data) {
        dataPoints = dataPoints.map(dataPoint => {
          if (dataPoint.label === data.os) {
            dataPoint.y += data.points
            return dataPoint
          }

          return dataPoint
        })

        chart.render()
      })
    }
  })
