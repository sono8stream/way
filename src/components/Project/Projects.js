import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';



class Projects extends Component {
  constructor(props){
    super(props);
    this.state={
    };
  }

  toProject(id){
    this.props.history.push(`/projects/${id}`);
  }

  render() {
    const style = {
      cardWrapper: {
        width: "90%",
        margin: "0 auto",
      },
      cardButton: {
        width: "100%",
        height: "100%"
      }
    }
    const projects = this.props.projects;

    return (
      <div className="Projects">
        <h2>プロジェクト一覧</h2>
        <Grid container spacing={24} style={style.cardWrapper}>
          {(()=>{
            if(projects) {
              return (Object.keys(projects).map((key, i) => {
                return (
                  <Grid item xs={12} sm={6}>
                    <Card>
                      <CardContent>
                        { projects[key].name }
                      </CardContent>
                      <CardActions>
                        <Button key={i}
                                onClick={() => this.toProject(key)}
                                style={style.cardButton}>
                          詳細
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              }));
            }
          })()}
        </Grid>
      </div>
    );
  }
}


export default Projects;