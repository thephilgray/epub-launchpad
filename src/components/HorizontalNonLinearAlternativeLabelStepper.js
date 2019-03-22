import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Slide from '@material-ui/core/Slide';
import Fade from '@material-ui/core/Fade';
import DeviceChoices from './DeviceChoices';
import logo from '../logo.svg';

const useStyles = makeStyles(theme => ({
  root: {
    width: '90%'
  },
  button: {
    marginRight: '1em'
  },
  backButton: {
    marginRight: '1em'
  },
  completed: {
    display: 'inline-block'
  },
  instructions: {
    marginTop: '1em',
    marginBottom: '1em',
    color: '#fff'
  }
}));

function getSteps() {
  return ['Select EPUB project', 'Select device ratio', 'Launch EPUB'];
}

function HorizontalNonLinearAlternativeLabelStepper({
  dragging,
  projectDir,
  dropped,
  launch,
  setDropped
}) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState(new Set());
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();

  function totalSteps() {
    return getSteps().length;
  }

  function isStepOptional(step) {
    return step === 1;
  }

  function handleSkip() {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(prevSkipped => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  }

  function skippedSteps() {
    return skipped.size;
  }

  function completedSteps() {
    return completed.size;
  }

  function allStepsCompleted() {
    return completedSteps() === totalSteps() - skippedSteps();
  }

  function isLastStep() {
    return activeStep === totalSteps() - 1;
  }

  function handleNext() {
    let newActiveStep;

    if (isLastStep() && !allStepsCompleted()) {
      // It's the last step, but not all steps have been completed
      // find the first step that has been completed
      newActiveStep = steps.findIndex((step, i) => !completed.has(i));
    } else {
      newActiveStep = activeStep + 1;
    }
    setActiveStep(newActiveStep);
  }

  function handleBack() {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  }

  const handleStep = step => () => {
    setActiveStep(step);
  };

  function handleComplete() {
    const newCompleted = new Set(completed);
    newCompleted.add(activeStep);
    setCompleted(newCompleted);

    /**
     * Sigh... it would be much nicer to replace the following if conditional with
     * `if (!this.allStepsComplete())` however state is not set when we do this,
     * thus we have to resort to not being very DRY.
     */
    if (completed.size !== totalSteps() - skippedSteps()) {
      handleNext();
    }
  }

  function handleReset() {
    setActiveStep(0);
    setCompleted(new Set());
    setSkipped(new Set());
  }

  function isStepSkipped(step) {
    return skipped.has(step);
  }

  function isStepComplete(step) {
    return completed.has(step);
  }

  return (
    <div className={classes.root}>
      <div>
        <Fade
          in={activeStep === 0}
          mountOnEnter
          unmountOnExit
          timeout={{ enter: 1000, exit: 0 }}
        >
          <img src={logo} className="App-logo" alt="logo" />
        </Fade>
        <Slide
          direction="right"
          in={activeStep === 1}
          mountOnEnter
          unmountOnExit
          timeout={{ enter: 1000, exit: 0 }}
        >
          <DeviceChoices />
        </Slide>

        {activeStep === 0 && (
          <>
            <Typography className={classes.instructions}>
              {!dragging &&
                !projectDir &&
                `Step 1: Drag & drop an unzipped EPUB directory into the window.`}
              {dragging && `Drop!`}
              {dropped && handleComplete(activeStep)}
            </Typography>
          </>
        )}
        {activeStep === 1 && (
          <>
            {setDropped(false)}
            <Typography className={classes.instructions}>
              Step 2: Select a device frame for the preview window.
            </Typography>
          </>
        )}
      </div>
      <Stepper alternativeLabel nonLinear activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const buttonProps = {};
          if (isStepOptional(index)) {
            buttonProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepButton
                onClick={handleStep(index)}
                completed={isStepComplete(index)}
                {...buttonProps}
              >
                {label}
              </StepButton>
            </Step>
          );
        })}
      </Stepper>
      {projectDir && (
        <Typography className={classes.instructions}>
          Project: {projectDir}
        </Typography>
      )}
      {/* <div>
        {allStepsCompleted() ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
          <div>
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                Next
              </Button>
              {isStepOptional(activeStep) && !completed.has(activeStep) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSkip}
                  className={classes.button}
                >
                  Skip
                </Button>
              )}

              {isStepComplete(0) && (
                <Button variant="contained" color="primary" onClick={launch}>
                  Launch Now
                </Button>
              )}

              {activeStep !== steps.length &&
                (completed.has(activeStep) ? (
                  <Typography variant="caption" className={classes.completed}>
                    Step {activeStep + 1} already completed
                  </Typography>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleComplete}
                  >
                    {completedSteps() === totalSteps() - 1
                      ? 'Finish'
                      : 'Complete Step'}
                  </Button>
                ))}
   
            </div>
          </div>
        )}
      </div> */}
    </div>
  );
}

export default HorizontalNonLinearAlternativeLabelStepper;
