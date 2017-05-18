class JsonReader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        fetch('http://keios.dy.fi:3000/')
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                this.setState({ data: json });
            });
    }

    render() {
        const data = this.state.data.map((json, index) =>
            <tr key={index}>
                <td>
                    {json.ts}
                </td>
                <td>
                    {json.temperature}
                </td>
                <td>
                    {json.battery}
                </td>
            </tr>
        );
        console.log(data);
        return (              
            <table className="tsDataTable">
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>Temperature</th>
                        <th>Battery</th>
                    </tr>
                </thead>
                <tbody>
                    {data}
                </tbody>
            </table>         
            );
    }
}

ReactDOM.render(
    <JsonReader />,
    document.getElementById('jsonDiv')
);
