class JsonReader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
    }

    componentDidMount() {
        fetch('http://localhost:3000/')
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
                    {json.temperature}
                </td>
                <td>
                    {json.battery}
                </td>
            </tr>
        );
        console.log(data);
        return (              
            <table>
                <thead>
                    <tr>
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
    document.getElementById('jsonInput')
);