import '../assets/styles/SnakeBlocks.css';

function SnakeBlocks({ snakePosition }) {
    return (
        <>
            {snakePosition.map((item, index) => {
                const block = {
                    top: `${item['y']}px`,
                    left: `${item['x']}px`,
                };

                return(
                    <div className="snake-block" style={block} key={index} />
                )
            })}
        </>
    );
}

export default SnakeBlocks;