import React from 'react'
import ModalContextProvider from '../../contexts/modalContext';
import ScrollArea from 'react-scrollbar';
import ListBlogs from './ListBlogs';

class Blogs extends React.Component{

    render() {

        let scrollbarStyles = {borderRadius: 5};

        return (
            <div>
                <ModalContextProvider>
                    <ScrollArea
                        className="area"
                        contentClassName="content"
                        verticalScrollbarStyle={scrollbarStyles}
                        verticalContainerStyle={scrollbarStyles}
                        horizontalScrollbarStyle={scrollbarStyles}
                        horizontalContainerStyle={scrollbarStyles}
                        smoothScrolling= {true}
                        minScrollSize={40}
                    >
                    <ListBlogs/>
                    </ScrollArea>
                </ModalContextProvider>
            </div>
        );
    }
}

export default Blogs;