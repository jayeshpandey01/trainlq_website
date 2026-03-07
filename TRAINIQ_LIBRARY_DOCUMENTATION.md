# TrainIQ: Universal AutoML Library - Complete Technical Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Core Architecture](#core-architecture)
3. [Module Reference](#module-reference)
4. [Installation & Setup](#installation--setup)
5. [Quick Start Guide](#quick-start-guide)
6. [Advanced Features](#advanced-features)
7. [API Reference](#api-reference)
8. [CLI Commands](#cli-commands)
9. [Examples & Use Cases](#examples--use-cases)
10. [Performance & Optimization](#performance--optimization)

---

## Overview

TrainIQ is a comprehensive, production-ready AutoML library that automates the entire machine learning pipeline from data ingestion to model deployment. Built on PyTorch and scikit-learn, it supports multiple data modalities and provides state-of-the-art models with minimal configuration.

### Key Features

- **Automatic Everything**: Data type detection, task detection, model selection, and preprocessing
- **Multi-Modal Support**: Tabular, Image, Text, Audio, and Time-Series data
- **One-Line Training**: Complete ML pipelines with a single function call
- **Hyperparameter Optimization**: Built-in Optuna integration
- **Production Ready**: Export to ONNX/TorchScript, FastAPI scaffold generation
- **AI Research Assistant**: WebResearch Engine with Ollama & HuggingFace LLM support
- **Flexible Architecture**: Extensible design for custom models and workflows

### Version Information

- **Current Version**: 0.1.3
- **Python Support**: 3.9+
- **License**: MIT
- **Author**: Jayesh Pandey

---

## Core Architecture

TrainIQ follows a modular architecture with clear separation of concerns:

```
trainiq/
├── __init__.py          # Main API entry point
├── cli.py               # Command-line interface
├── config.py            # Configuration management
├── detector.py          # Data type & task detection
├── data_loader.py       # Multi-modal data loading
├── preprocessing.py     # Data preprocessing pipelines
├── model_zoo.py         # Model registry & factory
├── model_selector.py    # Automatic model selection
├── architecture.py      # Custom architecture builder
├── trainer.py           # Training engine
├── tuner.py             # Hyperparameter optimization
├── metrics.py           # Evaluation & visualization
├── callbacks.py         # Training callbacks
├── inference.py         # Prediction interface
├── exporter.py          # Model export & deployment
├── ensemble.py          # Model ensembling
├── hardware.py          # Hardware detection
├── research.py          # WebResearch Engine
└── utils.py             # Shared utilities
```


## Module Reference

### 1. Core Module (`trainiq/__init__.py`)

The main entry point providing the high-level `trainiq` class that orchestrates the entire ML pipeline.

#### Class: `trainiq`

**Purpose**: High-level API for end-to-end ML workflows

**Key Methods**:
- `train()`: Execute complete training pipeline (detect → load → build → train → evaluate)
- `predict(data)`: Run inference on new data
- `export(format)`: Export model to TorchScript/ONNX
- `deploy(output_dir)`: Generate FastAPI deployment scaffold
- `tune_and_train()`: Run hyperparameter optimization then train

**Workflow**:
1. Detect data type (tabular/image/text/timeseries)
2. Load and preprocess data
3. Detect task (classification/regression/forecasting)
4. Select or build model
5. Train with early stopping and checkpointing
6. Evaluate and generate metrics
7. Save best model

**Example**:
```python
from trainiq import trainiq, trainiqConfig

config = trainiqConfig(
    data_path="dataset.csv",
    target_column="label",
    epochs=50
)

model = trainiq(config)
results = model.train()
predictions = model.predict(new_data)
```

---

### 2. Configuration Module (`trainiq/config.py`)

Centralized configuration management using dataclasses.

#### Class: `trainiqConfig`

**Purpose**: Single source of truth for all pipeline parameters

**Configuration Categories**:

**Data Configuration**:
- `data_path`: Path to dataset (required)
- `data_type`: "tabular", "image", "text", "timeseries", "audio" (auto-detected)
- `task`: "classification", "regression", "forecasting" (auto-detected)
- `target_column`: Target column name for tabular data
- `val_split`: Validation split ratio (default: 0.2)
- `test_split`: Test split ratio (default: 0.0)
- `max_samples`: Limit dataset size for experiments

**Model Configuration**:
- `model_family`: Model family (e.g., "cnn", "transformer")
- `model_name`: Specific model (e.g., "resnet18", "distilbert")
- `layers`: Hidden layer sizes for custom architectures
- `activations`: Activation function ("relu", "gelu", "silu")
- `dropout`: Dropout rate (default: 0.3)
- `pretrained`: Use pretrained weights (default: True)

**Training Configuration**:
- `epochs`: Number of training epochs (default: 50)
- `batch_size`: Batch size (default: 32)
- `learning_rate`: Learning rate (default: 1e-3)
- `optimizer`: "adam", "adamw", "sgd" (default: "adam")
- `weight_decay`: L2 regularization (default: 1e-4)
- `scheduler`: LR scheduler ("cosine", "step", "plateau")
- `early_stopping_patience`: Early stopping patience (default: 7)
- `gradient_clip`: Gradient clipping threshold (default: 1.0)

**Advanced Features**:
- `cv_folds`: K-fold cross-validation (default: 1)
- `class_weights`: Handle class imbalance ("auto" or None)
- `lr_finder`: Auto-find optimal learning rate
- `ensemble`: Enable model ensembling
- `ensemble_top_n`: Number of models to ensemble (default: 3)

**Hyperparameter Tuning**:
- `tune`: Enable HPO (default: False)
- `tune_trials`: Number of Optuna trials (default: 30)
- `tune_timeout`: Timeout in seconds

**Hardware Configuration**:
- `device`: "cpu", "cuda", "mps" (auto-detected)
- `num_workers`: Data loading workers (default: 4)
- `pin_memory`: Pin memory for GPU (default: True)
- `mixed_precision`: Enable AMP (default: True)

**Output Configuration**:
- `output_dir`: Output directory (default: "trainiq_output")
- `checkpoint_dir`: Checkpoint directory
- `save_best_only`: Save only best model (default: True)
- `use_tensorboard`: Enable TensorBoard logging

**Export Configuration**:
- `export_format`: "torchscript", "onnx", "both"
- `export_path`: Export directory

**Miscellaneous**:
- `seed`: Random seed (default: 42)
- `verbose`: Verbose logging (default: True)
- `extra`: Additional parameters as dict


---

### 3. Data Detection Module (`trainiq/detector.py`)

Automatic detection of data types and ML tasks.

#### Function: `detect_data_type(path: str) -> str`

**Purpose**: Automatically identify data modality from file/folder structure

**Detection Logic**:
- **Single File**: Uses file extension
  - CSV/Excel/Parquet → Tabular or Time-Series
  - JPG/PNG → Image
  - WAV/MP3 → Audio
  - TXT/JSONL → Text
- **Directory**: Majority vote on file extensions
  - Checks for image folder structure (class subdirectories)

**Returns**: One of "tabular", "image", "text", "audio", "video", "timeseries"

**Example**:
```python
from trainiq.detector import detect_data_type

data_type = detect_data_type("data.csv")  # Returns "tabular"
data_type = detect_data_type("images/")   # Returns "image"
```

#### Function: `detect_task(data, data_type, target_column, num_classes) -> str`

**Purpose**: Infer ML task type from data characteristics

**Detection Logic**:
- **Time-Series Data**: Returns "forecasting"
- **Image/Audio/Video**: Returns "classification" (default)
- **Text**: Returns "classification"
- **Tabular**: Analyzes target column
  - Object/Boolean dtype → Classification
  - ≤20 unique values & <5% cardinality → Classification
  - Otherwise → Regression

**Returns**: One of "classification", "regression", "forecasting"

---

### 4. Data Loading Module (`trainiq/data_loader.py`)

Universal data ingestion for all modalities.

#### Function: `load_data(config, data_type) -> dict`

**Purpose**: Load and preprocess data based on modality

**Returns Dictionary**:
- `train_loader`: PyTorch DataLoader for training
- `val_loader`: PyTorch DataLoader for validation
- `num_classes`: Number of classes (or 1 for regression)
- `input_shape`: Input tensor shape
- `dataset_info`: Metadata about the dataset

#### Dataset Classes

**TabularDataset**:
- In-memory dataset for tabular data
- Automatic preprocessing: missing value imputation, one-hot encoding, scaling
- Supports CSV, Excel, Parquet, JSON formats

**ImageFolderDataset**:
- Loads images from class-subfolder structure: `root/<class>/<image>`
- Automatic transforms: resize to 224×224, normalization
- Supports JPG, PNG, BMP, GIF, TIFF, WebP

**TextDataset**:
- Tokenizes text using HuggingFace transformers
- Default tokenizer: DistilBERT
- Max sequence length: 256 tokens
- Returns dict with input_ids, attention_mask, labels

**TimeSeriesDataset**:
- Sliding window approach for sequential data
- Configurable window size and forecast horizon
- Automatic normalization (z-score)

**Example**:
```python
from trainiq.data_loader import load_data
from trainiq.config import trainiqConfig

config = trainiqConfig(data_path="data.csv", target_column="label")
data = load_data(config, "tabular")

print(f"Training samples: {data['dataset_info']['train_samples']}")
print(f"Input shape: {data['input_shape']}")
```

---

### 5. Preprocessing Module (`trainiq/preprocessing.py`)

Data preprocessing pipelines for different modalities.

#### Function: `preprocess_tabular(df: pd.DataFrame) -> tuple`

**Purpose**: Auto-preprocess tabular data

**Pipeline Steps**:
1. **Drop High-Missing Columns**: Remove columns with >50% missing values
2. **Impute Missing Values**:
   - Numeric: Median imputation
   - Categorical: Mode imputation
3. **Encode Categoricals**: One-hot encoding with drop_first=True
4. **Scale Numerics**: Standard scaling (z-score normalization)

**Returns**: `(X_array, encoders_dict)`
- `X_array`: Preprocessed numpy array
- `encoders_dict`: Fitted transformers for inference

**Example**:
```python
from trainiq.preprocessing import preprocess_tabular
import pandas as pd

df = pd.read_csv("data.csv")
X, encoders = preprocess_tabular(df)
```

#### Function: `preprocess_text(texts: list[str]) -> list[str]`

**Purpose**: Basic text cleaning

**Operations**:
- Strip whitespace
- Convert to lowercase
- Remove special characters (optional)


---

### 6. Model Zoo Module (`trainiq/model_zoo.py`)

Registry of pre-built models and factory functions.

#### Function: `list_models(data_type: str, task: str) -> list[str]`

**Purpose**: Get available models for a given data type and task

**Model Registry**:

**Tabular Models**:
- `tabular_net`: Fully-connected neural network (PyTorch)
- `sklearn_rf`: Random Forest (scikit-learn)
- `sklearn_xgb`: XGBoost/Gradient Boosting

**Image Models**:
- `resnet18`: ResNet-18 (11M params, fast)
- `resnet50`: ResNet-50 (25M params, higher accuracy)
- `efficientnet_b0`: EfficientNet-B0 (5M params, efficient)

**Text Models**:
- `text_cnn`: 1D CNN for text (<1M params, fast)
- `distilbert`: DistilBERT (66M params, transformer-based)

**Time-Series Models**:
- `lstm`: LSTM recurrent network
- `transformer_ts`: Transformer encoder for sequences

#### Function: `build_model(model_name, input_shape, num_classes, config) -> nn.Module`

**Purpose**: Instantiate a model by name

**Example**:
```python
from trainiq.model_zoo import list_models, build_model
from trainiq.config import trainiqConfig

# List available models
models = list_models("tabular", "classification")
print(models)  # ['tabular_net', 'sklearn_rf', 'sklearn_xgb']

# Build a specific model
config = trainiqConfig()
model = build_model(
    "resnet18",
    input_shape=(3, 224, 224),
    num_classes=10,
    config=config
)
```

#### Built-in Model Classes

**TabularNet**:
- Fully-connected MLP with configurable layers
- Batch normalization after each layer
- Dropout for regularization
- Flexible activation functions

**LSTMModel**:
- Multi-layer LSTM for sequential data
- Configurable hidden dimensions and layers
- Dropout between LSTM layers
- Final linear projection

**TextCNN**:
- 1D convolutional network for text
- Multiple filter sizes (3, 4, 5)
- Max-pooling over time
- Dropout before final classification

---

### 7. Model Selection Module (`trainiq/model_selector.py`)

Automatic model comparison and selection.

#### Class: `ModelSelector`

**Purpose**: Train multiple candidate models and select the best

**Workflow**:
1. Get candidate models for data type and task
2. Train each model with reduced epochs (quick evaluation)
3. Rank models by validation performance
4. Return best model and results

**Methods**:
- `select_best(train_loader, val_loader, ...)`: Train all candidates and return winner
- `get_leaderboard_df()`: Get ranking as pandas DataFrame

**Example**:
```python
from trainiq.model_selector import ModelSelector
from trainiq.config import trainiqConfig

config = trainiqConfig(data_path="data.csv")
selector = ModelSelector(config)

best_model, results = selector.select_best(
    train_loader, val_loader,
    data_type="tabular",
    task="classification",
    num_classes=3,
    input_shape=(10,)
)

print(f"Best model: {results['model_name']}")
leaderboard = selector.get_leaderboard_df()
print(leaderboard)
```

---

### 8. Architecture Builder Module (`trainiq/architecture.py`)

Dynamic neural network construction.

#### Function: `build_custom_mlp(input_dim, output_dim, config) -> nn.Module`

**Purpose**: Build fully-connected network from config

**Features**:
- Configurable layer sizes via `config.layers`
- Multiple activation functions (ReLU, GELU, SiLU, Tanh, etc.)
- Batch normalization after each layer
- Dropout for regularization

**Example**:
```python
from trainiq.architecture import build_custom_mlp
from trainiq.config import trainiqConfig

config = trainiqConfig(
    layers=[512, 256, 128],
    activations="gelu",
    dropout=0.4
)

model = build_custom_mlp(
    input_dim=100,
    output_dim=10,
    config=config
)
```

#### Function: `build_custom_cnn(num_classes, in_channels, config) -> nn.Module`

**Purpose**: Build lightweight CNN for images

**Architecture**:
- Configurable channel sizes via `config.layers`
- Conv2D → BatchNorm → Activation → MaxPool blocks
- Adaptive average pooling
- Dropout before final classification


---

### 9. Training Module (`trainiq/trainer.py`)

Full-featured training engine with advanced capabilities.

#### Class: `Trainer`

**Purpose**: Manage complete training lifecycle for PyTorch models

**Features**:
- Epoch loop with progress bars (tqdm)
- Validation after each epoch
- Early stopping with patience
- Model checkpointing (save best)
- Gradient clipping
- Mixed-precision training (AMP)
- Learning rate scheduling
- Custom callbacks support
- K-fold cross-validation
- Learning rate finder (Fast.ai style)

**Key Methods**:

**`train(train_loader, val_loader, num_classes, task) -> dict`**:
- Main training loop
- Returns history dict with losses and accuracies
- Saves best model checkpoint

**`train_cv(dataset, num_classes, task, n_splits) -> dict`**:
- K-fold cross-validation
- Returns aggregated results across folds

**`find_lr(loader, task) -> float`**:
- Automatic learning rate finder
- Tests range from 1e-8 to 10
- Returns optimal LR based on steepest gradient

**Training History**:
```python
{
    "train_loss": [0.5, 0.3, 0.2, ...],
    "val_loss": [0.6, 0.4, 0.3, ...],
    "train_acc": [0.7, 0.85, 0.9, ...],
    "val_acc": [0.65, 0.8, 0.85, ...],
    "best_val_acc": 0.92,
    "best_val_loss": 0.25,
    "best_model_path": "checkpoints/best_model.pt",
    "epochs_trained": 45
}
```

**Example**:
```python
from trainiq.trainer import Trainer
from trainiq.config import trainiqConfig

config = trainiqConfig(
    epochs=100,
    learning_rate=1e-3,
    early_stopping_patience=10,
    gradient_clip=1.0,
    mixed_precision=True
)

trainer = Trainer(model, config)
results = trainer.train(train_loader, val_loader, num_classes=10, task="classification")

print(f"Best accuracy: {results['best_val_acc']:.4f}")
```

#### Function: `train_sklearn(model, train_loader, val_loader, task) -> dict`

**Purpose**: Train scikit-learn models from DataLoaders

**Features**:
- Collects all data from loaders
- Fits sklearn estimator
- Evaluates on validation set
- Returns metrics dict

---

### 10. Hyperparameter Tuning Module (`trainiq/tuner.py`)

Optuna-based hyperparameter optimization.

#### Function: `tune_hyperparameters(objective_fn, config, direction) -> dict`

**Purpose**: Run Optuna HPO study

**Parameters**:
- `objective_fn`: Function that takes trial and returns metric
- `config`: trainiqConfig with tune_trials and tune_timeout
- `direction`: "maximize" for accuracy, "minimize" for loss

**Returns**: Best hyperparameters as dict

#### Function: `suggest_params(trial) -> dict`

**Purpose**: Suggest standard hyperparameters for neural networks

**Suggested Parameters**:
- `learning_rate`: Log-uniform from 1e-5 to 1e-1
- `batch_size`: Categorical [16, 32, 64, 128]
- `optimizer`: Categorical ["adam", "adamw", "sgd"]
- `dropout`: Uniform from 0.1 to 0.5
- `weight_decay`: Log-uniform from 1e-6 to 1e-2
- `hidden_1`: Integer from 64 to 512 (step 64)
- `hidden_2`: Integer from 32 to 256 (step 32)

**Example**:
```python
from trainiq.tuner import tune_hyperparameters, suggest_params
from trainiq.config import trainiqConfig

def objective(trial):
    params = suggest_params(trial)
    
    # Build and train model with suggested params
    config = trainiqConfig(
        learning_rate=params["learning_rate"],
        batch_size=params["batch_size"],
        optimizer=params["optimizer"],
        dropout=params["dropout"]
    )
    
    # ... train and evaluate ...
    return validation_accuracy

config = trainiqConfig(tune_trials=50, tune_timeout=3600)
best_params = tune_hyperparameters(objective, config, direction="maximize")
print(f"Best params: {best_params}")
```

#### Function: `suggest_sklearn_params(trial, model_type) -> dict`

**Purpose**: Suggest hyperparameters for sklearn/XGBoost models

**Supported Models**:
- Random Forest: n_estimators, max_depth, min_samples_split, min_samples_leaf
- XGBoost: n_estimators, max_depth, learning_rate, subsample, colsample_bytree


---

### 11. Metrics & Visualization Module (`trainiq/metrics.py`)

Evaluation metrics and automatic visualization.

#### Function: `compute_metrics(model, loader, task, device, num_classes) -> dict`

**Purpose**: Evaluate model and compute comprehensive metrics

**Classification Metrics**:
- Accuracy
- F1 Score (macro)
- Precision (macro)
- Recall (macro)
- Classification report
- Confusion matrix

**Regression Metrics**:
- MSE (Mean Squared Error)
- RMSE (Root Mean Squared Error)
- MAE (Mean Absolute Error)
- R² Score

**Example**:
```python
from trainiq.metrics import compute_metrics

metrics = compute_metrics(
    model, val_loader,
    task="classification",
    num_classes=10
)

print(f"Accuracy: {metrics['accuracy']:.4f}")
print(f"F1 Score: {metrics['f1_macro']:.4f}")
print(metrics['classification_report'])
```

#### Function: `plot_training_history(history, output_dir) -> str`

**Purpose**: Plot loss and accuracy curves

**Generates**:
- Dual subplot figure
- Training vs validation loss
- Training vs validation accuracy
- Saved as PNG with 150 DPI

**Returns**: Path to saved plot

#### Function: `plot_confusion_matrix(cm, class_names, output_dir) -> str`

**Purpose**: Visualize confusion matrix as heatmap

**Features**:
- Color-coded cells (Blues colormap)
- Annotated with counts
- Automatic text color adjustment
- Class name labels

---

### 12. Callbacks Module (`trainiq/callbacks.py`)

Pluggable callback system for custom training logic.

#### Class: `Callback`

**Purpose**: Base class for all callbacks

**Hook Methods**:
- `on_train_begin(config)`: Called before training starts
- `on_train_end(history)`: Called after training completes
- `on_epoch_begin(epoch)`: Called at start of each epoch
- `on_epoch_end(epoch, metrics)`: Called at end of each epoch
- `on_batch_begin(batch)`: Called before each batch
- `on_batch_end(batch, loss)`: Called after each batch

**Example Custom Callback**:
```python
from trainiq.callbacks import Callback

class LearningRateLogger(Callback):
    def on_epoch_end(self, epoch, metrics):
        lr = self.trainer.optimizer.param_groups[0]['lr']
        print(f"Epoch {epoch}: LR = {lr:.6f}")

# Use in trainer
trainer = Trainer(model, config, callbacks=[LearningRateLogger()])
```

#### Class: `CallbackList`

**Purpose**: Container for managing multiple callbacks

**Features**:
- Executes callbacks in order
- Handles exceptions gracefully
- Supports dynamic callback addition

---

### 13. Inference Module (`trainiq/inference.py`)

Unified prediction interface for trained models.

#### Class: `Predictor`

**Purpose**: Load trained models and run inference

**Key Methods**:

**`predict(data) -> np.ndarray`**:
- Supports multiple input types:
  - numpy arrays
  - torch tensors
  - list of strings (text)
  - dict with input_ids/attention_mask
- Returns predictions as numpy array

**`predict_proba(data) -> np.ndarray`**:
- Returns class probabilities (softmax)
- Only for classification models

**`from_checkpoint(checkpoint_path, model, config) -> Predictor`**:
- Class method to load from checkpoint
- Restores model weights

**Example**:
```python
from trainiq.inference import Predictor
from trainiq.config import trainiqConfig

# Load from checkpoint
predictor = Predictor.from_checkpoint(
    "trainiq_output/checkpoints/best_model.pt",
    model,
    config
)

# Make predictions
predictions = predictor.predict(test_data)
probabilities = predictor.predict_proba(test_data)

print(f"Predictions: {predictions}")
print(f"Probabilities: {probabilities}")
```

---

### 14. Export & Deployment Module (`trainiq/exporter.py`)

Model export and API generation.

#### Function: `export_model(model, input_shape, config) -> dict`

**Purpose**: Export PyTorch models to production formats

**Supported Formats**:
- **TorchScript**: Optimized PyTorch format for C++ deployment
  - Uses torch.jit.trace (preferred)
  - Falls back to torch.jit.script if tracing fails
- **ONNX**: Open Neural Network Exchange format
  - Cross-framework compatibility
  - Dynamic batch size support
  - Opset version 14

**Returns**: Dict mapping format to file path

**Example**:
```python
from trainiq.exporter import export_model
from trainiq.config import trainiqConfig

config = trainiqConfig(export_format="both")
paths = export_model(model, input_shape=(3, 224, 224), config=config)

print(f"TorchScript: {paths['torchscript']}")
print(f"ONNX: {paths['onnx']}")
```

#### Function: `scaffold_api(model_path, output_dir) -> str`

**Purpose**: Generate FastAPI deployment scaffold

**Generated Files**:
- `app.py`: FastAPI application with prediction endpoint
- `Dockerfile`: Container configuration
- `requirements.txt`: Python dependencies

**API Endpoints**:
- `POST /predict`: Inference endpoint
- `GET /health`: Health check

**Example**:
```python
from trainiq.exporter import scaffold_api

api_path = scaffold_api(
    model_path="trainiq_output/exported/model_scripted.pt",
    output_dir="my_api"
)

# Run the API:
# cd my_api
# pip install -r requirements.txt
# uvicorn app:app --reload
```


---

### 15. Ensemble Module (`trainiq/ensemble.py`)

Model ensembling for improved performance.

#### Class: `EnsembleModel`

**Purpose**: Combine multiple models via voting or averaging

**Features**:
- Supports both PyTorch and sklearn models
- Weighted averaging of predictions
- Soft voting for classification
- Automatic handling of mixed model types

**Methods**:
- `forward(x)`: Average forward pass for PyTorch models
- `predict(x)`: Unified prediction for ensemble

**Example**:
```python
from trainiq.ensemble import create_voting_ensemble

# Train multiple models
models = [model1, model2, model3]

# Create ensemble
ensemble = create_voting_ensemble(models, task="classification")

# Make predictions
predictions = ensemble.predict(test_data)
```

#### Function: `create_voting_ensemble(models, task) -> EnsembleModel`

**Purpose**: Helper to create ensemble from model list

**Ensemble Strategies**:
- **Classification**: Soft voting (average probabilities)
- **Regression**: Average predictions

---

### 16. Hardware Detection Module (`trainiq/hardware.py`)

Automatic hardware detection and optimization.

#### Function: `detect_device(preferred) -> torch.device`

**Purpose**: Return the fastest available compute device

**Priority Order**:
1. User-specified device (if provided)
2. CUDA GPU (if available)
3. Apple MPS (if available)
4. CPU (fallback)

**Example**:
```python
from trainiq.hardware import detect_device

device = detect_device()  # Auto-detect
print(f"Using device: {device}")

device = detect_device("cuda:1")  # Force specific GPU
```

#### Function: `device_summary() -> dict`

**Purpose**: Get comprehensive hardware information

**Returns**:
```python
{
    "cpu_count": 8,
    "cuda": {
        "device_count": 2,
        "devices": ["NVIDIA RTX 3090", "NVIDIA RTX 3080"]
    },
    "mps_available": False
}
```

---

### 17. WebResearch Engine Module (`trainiq/research.py`)

AI-powered web research with LLM integration.

#### Class: `WebResearchEngine`

**Purpose**: Automated web scraping, analysis, and LLM-based answering

**Features**:
- DuckDuckGo web search
- Asynchronous page scraping
- FAISS vector database for semantic search
- Dual LLM support: Ollama (local) and HuggingFace (cloud/local)
- Multiple research modes

**Parameters**:
- `embedding_model_name`: Sentence transformer model (default: "all-MiniLM-L6-v2")
- `llm_model`: LLM model name (default: "llama3" for Ollama)
- `llm_provider`: "ollama" or "huggingface" (default: "ollama")
- `hf_token`: HuggingFace API token (for gated models)
- `max_sources`: Max search results to scrape (default: 5)
- `style`: Summarization style (default: "concise")
- `research_mode`: "general", "academic", "documentation", "github"

**Workflow**:
1. Search web with DuckDuckGo
2. Scrape pages asynchronously
3. Chunk and embed content
4. Build FAISS vector database
5. Retrieve relevant context
6. Generate answer with LLM

**Example**:
```python
from trainiq.research import research

# Using HuggingFace
results = research(
    query="What is transfer learning in deep learning?",
    llm_provider="huggingface",
    llm_model="google/flan-t5-base",
    max_sources=5,
    research_mode="academic"
)

print(f"Answer: {results['answer']}")
print(f"References: {results['references']}")
print(f"Context used: {results['context_used']} chunks")

# Using Ollama (local)
results = research(
    query="Explain gradient descent",
    llm_provider="ollama",
    llm_model="llama3"
)
```

**Research Modes**:
- **general**: Broad web search
- **academic**: Focus on papers and educational content (arxiv.org, .edu)
- **documentation**: Focus on official documentation
- **github**: Focus on code repositories

**Recommended HuggingFace Models**:
- `google/flan-t5-small`: Fast, lightweight (80M params)
- `google/flan-t5-base`: Balanced (250M params)
- `microsoft/phi-2`: High quality (2.7B params)
- `meta-llama/Llama-2-7b-chat-hf`: Best quality (7B params, requires token)
- `mistralai/Mistral-7B-Instruct-v0.2`: Excellent quality (7B params)

---

### 18. Utilities Module (`trainiq/utils.py`)

Shared helper functions.

#### Function: `get_logger(name, level) -> logging.Logger`

**Purpose**: Get configured logger with console handler

**Features**:
- Formatted output with timestamps
- Configurable log level
- Prevents duplicate handlers

#### Function: `set_seed(seed)`

**Purpose**: Set random seed for reproducibility

**Sets Seeds For**:
- Python random module
- NumPy
- PyTorch (CPU and CUDA)
- cuDNN (deterministic mode)

#### Function: `ensure_dir(path) -> str`

**Purpose**: Create directory if it doesn't exist

**Returns**: The path (for chaining)

#### Context Manager: `timer(label)`

**Purpose**: Log elapsed time for code blocks

**Example**:
```python
from trainiq.utils import timer

with timer("Data loading"):
    data = load_large_dataset()
# Output: Data loading finished in 12.34s
```

#### Function: `file_extension(path) -> str`

**Purpose**: Get lowercase file extension without dot

#### Function: `list_files(directory, extensions) -> list[str]`

**Purpose**: Recursively list files with optional extension filter


---

### 19. CLI Module (`trainiq/cli.py`)

Command-line interface for no-code workflows.

#### Main Commands

**`trainiq train`**: Train a model on a dataset

**Arguments**:
- Data: `--data`, `--task`, `--data-type`, `--target`
- Model: `--model`, `--no-pretrained`
- Training: `--epochs`, `--batch-size`, `--lr`, `--optimizer`
- Tuning: `--tune`, `--tune-trials`
- System: `--output`, `--device`, `--seed`
- Export: `--export`

**Example**:
```bash
# Basic training
trainiq train --data data.csv --target label --epochs 50

# With hyperparameter tuning
trainiq train --data data.csv --target label --tune --tune-trials 50

# Image classification
trainiq train --data images/ --data-type image --model resnet50 --epochs 100

# Export after training
trainiq train --data data.csv --target label --export onnx
```

**`trainiq predict`**: Run inference with trained model

**Arguments**:
- `--model-path`: Path to checkpoint
- `--data`: Input data path
- `--output`: Output file for predictions

**`trainiq export`**: Export model to production formats

**Arguments**:
- `--model-path`: Path to checkpoint
- `--format`: "torchscript", "onnx", "both"
- `--output`: Output directory

**`trainiq deploy`**: Generate FastAPI deployment scaffold

**Arguments**:
- `--model-path`: Path to exported model
- `--output`: Output directory for API

**`trainiq info`**: Show hardware and library information

**`trainiq research`**: Run WebResearch Engine

**Arguments**:
- `query`: Natural language prompt (positional)
- `--mode`: Research mode (general/academic/documentation/github)
- `--max-sources`: Max search results
- `--llm-provider`: "ollama" or "huggingface"
- `--llm`: LLM model name
- `--hf-token`: HuggingFace token
- `--embed-model`: Embedding model

**Example**:
```bash
# Using HuggingFace
trainiq research "What is deep learning?" \
  --llm-provider huggingface \
  --llm google/flan-t5-base \
  --max-sources 5

# Using Ollama
trainiq research "Explain CNNs" \
  --llm-provider ollama \
  --llm llama3

# Academic mode
trainiq research "Attention mechanism" \
  --mode academic \
  --llm-provider huggingface \
  --llm google/flan-t5-base
```

---

## Installation & Setup

### Basic Installation

```bash
pip install TrainIQ
```

### Installation with Optional Features

```bash
# All features
pip install TrainIQ[all]

# Text models (BERT, DistilBERT)
pip install TrainIQ[text]

# XGBoost support
pip install TrainIQ[xgboost]

# Deployment (FastAPI)
pip install TrainIQ[deploy]

# ONNX export
pip install TrainIQ[onnx]

# WebResearch Engine
pip install TrainIQ[research]
```

### System Requirements

- **Python**: 3.9 or higher
- **Operating Systems**: Windows, macOS, Linux
- **GPU Support**: CUDA 11.8+ (optional, for GPU acceleration)
- **Memory**: Minimum 4GB RAM (8GB+ recommended)

### Dependencies

**Core Dependencies**:
- numpy >= 1.21
- pandas >= 1.3
- scikit-learn >= 1.0
- torch >= 1.12
- torchvision >= 0.13
- matplotlib >= 3.5
- Pillow >= 9.0
- optuna >= 3.0

**Optional Dependencies**:
- transformers >= 4.20 (for text models)
- xgboost >= 1.6 (for XGBoost)
- fastapi >= 0.100 (for deployment)
- onnx >= 1.12 (for ONNX export)
- beautifulsoup4, aiohttp, sentence-transformers, faiss-cpu, ddgs, ollama (for research)

---

## Quick Start Guide

### 1. Tabular Classification

```python
from trainiq import trainiq, trainiqConfig

# Configure
config = trainiqConfig(
    data_path="iris.csv",
    target_column="species",
    epochs=50
)

# Train
model = trainiq(config)
results = model.train()

# Results
print(f"Accuracy: {results['best_val_acc']:.4f}")
print(f"Model saved: {results['best_model_path']}")

# Predict
predictions = model.predict(new_data)
```

### 2. Image Classification

```python
from trainiq import trainiq, trainiqConfig

# Folder structure: images/cat/, images/dog/, images/bird/
config = trainiqConfig(
    data_path="images/",
    data_type="image",
    model_name="resnet50",
    epochs=100,
    batch_size=64,
    pretrained=True
)

model = trainiq(config)
results = model.train()

# Export
model.export(format="onnx")
```

### 3. Text Classification

```python
from trainiq import trainiq, trainiqConfig

config = trainiqConfig(
    data_path="reviews.csv",
    target_column="sentiment",
    data_type="text",
    model_name="distilbert",
    epochs=10,
    batch_size=16
)

model = trainiq(config)
results = model.train()
```

### 4. Regression

```python
from trainiq import trainiq, trainiqConfig

config = trainiqConfig(
    data_path="housing.csv",
    target_column="price",
    task="regression",
    tune=True,
    tune_trials=30
)

model = trainiq(config)
results = model.train()

print(f"RMSE: {results['eval_metrics']['rmse']:.2f}")
```

### 5. Time-Series Forecasting

```python
from trainiq import trainiq, trainiqConfig

config = trainiqConfig(
    data_path="stock_prices.csv",
    data_type="timeseries",
    model_name="lstm",
    extra={
        "window": 30,    # Look back 30 time steps
        "horizon": 7     # Predict 7 steps ahead
    }
)

model = trainiq(config)
results = model.train()
```


---

## Advanced Features

### 1. Hyperparameter Optimization

TrainIQ uses Optuna for automatic hyperparameter tuning.

```python
from trainiq import trainiq, trainiqConfig

config = trainiqConfig(
    data_path="data.csv",
    target_column="label",
    tune=True,
    tune_trials=50,
    tune_timeout=3600  # 1 hour
)

model = trainiq(config)
results = model.tune_and_train()
```

**Tuned Parameters**:
- Learning rate (log-uniform: 1e-5 to 1e-1)
- Batch size (categorical: 16, 32, 64, 128)
- Optimizer (categorical: adam, adamw, sgd)
- Dropout (uniform: 0.1 to 0.5)
- Weight decay (log-uniform: 1e-6 to 1e-2)
- Hidden layer sizes

### 2. Model Ensembling

Combine multiple models for improved performance.

```python
from trainiq import trainiq, trainiqConfig

config = trainiqConfig(
    data_path="data.csv",
    target_column="label",
    ensemble=True,
    ensemble_top_n=3  # Ensemble top 3 models
)

model = trainiq(config)
results = model.train()
```

### 3. Learning Rate Finder

Automatically find optimal learning rate using Fast.ai's approach.

```python
from trainiq import trainiq, trainiqConfig

config = trainiqConfig(
    data_path="data.csv",
    target_column="label",
    lr_finder=True  # Auto-find LR before training
)

model = trainiq(config)
results = model.train()
```

### 4. K-Fold Cross-Validation

Robust evaluation with cross-validation.

```python
from trainiq import trainiq, trainiqConfig

config = trainiqConfig(
    data_path="data.csv",
    target_column="label",
    cv_folds=5  # 5-fold CV
)

model = trainiq(config)
results = model.train()
```

### 5. Class Imbalance Handling

Automatic class weight computation.

```python
from trainiq import trainiq, trainiqConfig

config = trainiqConfig(
    data_path="imbalanced_data.csv",
    target_column="label",
    class_weights="auto"  # Compute balanced weights
)

model = trainiq(config)
results = model.train()
```

### 6. Mixed Precision Training

Faster training with automatic mixed precision (AMP).

```python
from trainiq import trainiq, trainiqConfig

config = trainiqConfig(
    data_path="data.csv",
    target_column="label",
    mixed_precision=True,  # Enable AMP
    device="cuda"
)

model = trainiq(config)
results = model.train()
```

### 7. Custom Architectures

Build custom neural networks.

```python
from trainiq import trainiq, trainiqConfig

config = trainiqConfig(
    data_path="data.csv",
    target_column="label",
    layers=[512, 256, 128, 64],  # Custom layer sizes
    activations="gelu",           # GELU activation
    dropout=0.4                   # 40% dropout
)

model = trainiq(config)
results = model.train()
```

### 8. Learning Rate Scheduling

Automatic learning rate adjustment.

```python
from trainiq import trainiq, trainiqConfig

config = trainiqConfig(
    data_path="data.csv",
    target_column="label",
    scheduler="cosine",  # Cosine annealing
    # Options: "cosine", "step", "plateau"
)

model = trainiq(config)
results = model.train()
```

### 9. Early Stopping

Prevent overfitting with early stopping.

```python
from trainiq import trainiq, trainiqConfig

config = trainiqConfig(
    data_path="data.csv",
    target_column="label",
    early_stopping_patience=10  # Stop after 10 epochs without improvement
)

model = trainiq(config)
results = model.train()
```

### 10. Gradient Clipping

Stabilize training with gradient clipping.

```python
from trainiq import trainiq, trainiqConfig

config = trainiqConfig(
    data_path="data.csv",
    target_column="label",
    gradient_clip=1.0  # Clip gradients to max norm of 1.0
)

model = trainiq(config)
results = model.train()
```

---

## API Reference

### Main API

#### `trainiq(config: trainiqConfig, **kwargs)`

Main class for end-to-end ML workflows.

**Parameters**:
- `config`: trainiqConfig object or None
- `**kwargs`: Config parameters as keyword arguments

**Methods**:
- `train() -> dict`: Run full training pipeline
- `predict(data) -> np.ndarray`: Run inference
- `export(format: str) -> dict`: Export model
- `deploy(output_dir: str) -> str`: Generate API scaffold
- `tune_and_train() -> dict`: HPO then train

**Returns** (from train()):
```python
{
    "history": {
        "train_loss": [...],
        "val_loss": [...],
        "train_acc": [...],
        "val_acc": [...]
    },
    "best_val_acc": 0.92,
    "best_val_loss": 0.25,
    "best_model_path": "checkpoints/best_model.pt",
    "epochs_trained": 45,
    "eval_metrics": {
        "accuracy": 0.92,
        "f1_macro": 0.91,
        "precision_macro": 0.90,
        "recall_macro": 0.92,
        "confusion_matrix": [[...]]
    }
}
```

### Configuration API

#### `trainiqConfig(**kwargs)`

Configuration dataclass with all pipeline parameters.

**Key Parameters**:
- Data: `data_path`, `data_type`, `task`, `target_column`, `val_split`
- Model: `model_name`, `layers`, `activations`, `dropout`, `pretrained`
- Training: `epochs`, `batch_size`, `learning_rate`, `optimizer`
- Advanced: `tune`, `ensemble`, `lr_finder`, `cv_folds`, `class_weights`
- Hardware: `device`, `num_workers`, `mixed_precision`
- Output: `output_dir`, `checkpoint_dir`, `export_format`

**Methods**:
- `to_dict() -> dict`: Convert to dictionary
- `from_dict(d: dict) -> trainiqConfig`: Create from dictionary

### Research API

#### `research(query: str, **kwargs) -> dict`

Execute web research pipeline.

**Parameters**:
- `query`: Natural language prompt
- `embedding_model_name`: Embedding model (default: "all-MiniLM-L6-v2")
- `llm_model`: LLM model name (default: "llama3")
- `llm_provider`: "ollama" or "huggingface" (default: "ollama")
- `hf_token`: HuggingFace token (for gated models)
- `max_sources`: Max search results (default: 5)
- `style`: Summarization style (default: "concise")
- `research_mode`: "general", "academic", "documentation", "github"

**Returns**:
```python
{
    "query": "What is deep learning?",
    "answer": "Deep learning is...",
    "references": ["https://...", "https://..."],
    "context_used": 5
}
```


---

## CLI Commands

### Training Commands

#### Basic Training
```bash
trainiq train --data data.csv --target label
```

#### With Custom Parameters
```bash
trainiq train \
  --data housing.csv \
  --target price \
  --task regression \
  --epochs 100 \
  --batch-size 64 \
  --lr 0.001 \
  --optimizer adamw
```

#### With Hyperparameter Tuning
```bash
trainiq train \
  --data data.csv \
  --target label \
  --tune \
  --tune-trials 50
```

#### Image Classification
```bash
trainiq train \
  --data images/ \
  --data-type image \
  --model resnet50 \
  --epochs 200 \
  --batch-size 32
```

#### Export After Training
```bash
trainiq train \
  --data data.csv \
  --target label \
  --export onnx
```

### Prediction Commands

```bash
trainiq predict \
  --model-path trainiq_output/checkpoints/best_model.pt \
  --data test.csv \
  --output predictions.csv
```

### Export Commands

```bash
# Export to ONNX
trainiq export \
  --model-path trainiq_output/checkpoints/best_model.pt \
  --format onnx \
  --output exports/

# Export to both formats
trainiq export \
  --model-path model.pt \
  --format both
```

### Deployment Commands

```bash
trainiq deploy \
  --model-path trainiq_output/exported/model.onnx \
  --output my_api/

# Then run the API:
cd my_api
pip install -r requirements.txt
uvicorn app:app --reload
```

### System Information

```bash
trainiq info
```

**Output**:
```
trainiq — Universal trainiq Library
Best device  : cuda
Hardware info: {'cpu_count': 8, 'cuda': {'device_count': 1, 'devices': ['NVIDIA RTX 3090']}}
```

### Research Commands

```bash
# Basic research
trainiq research "What is deep learning?"

# With specific LLM provider
trainiq research "Explain CNNs" \
  --llm-provider huggingface \
  --llm google/flan-t5-base

# Academic mode
trainiq research "Attention mechanism" \
  --mode academic \
  --max-sources 5

# With HuggingFace token
trainiq research "Latest in NLP" \
  --llm-provider huggingface \
  --llm meta-llama/Llama-2-7b-chat-hf \
  --hf-token your_token_here
```

---

## Examples & Use Cases

### Example 1: Iris Classification

```python
from trainiq import trainiq, trainiqConfig
import pandas as pd

# Load data
df = pd.read_csv("iris.csv")

# Configure
config = trainiqConfig(
    data_path="iris.csv",
    target_column="species",
    epochs=50,
    batch_size=16
)

# Train
model = trainiq(config)
results = model.train()

# Evaluate
print(f"Accuracy: {results['best_val_acc']:.4f}")
print(f"F1 Score: {results['eval_metrics']['f1_macro']:.4f}")

# Predict
new_samples = [[5.1, 3.5, 1.4, 0.2], [6.7, 3.0, 5.2, 2.3]]
predictions = model.predict(new_samples)
print(f"Predictions: {predictions}")
```

### Example 2: House Price Prediction

```python
from trainiq import trainiq, trainiqConfig

config = trainiqConfig(
    data_path="housing.csv",
    target_column="price",
    task="regression",
    model_name="sklearn_xgb",
    tune=True,
    tune_trials=30
)

model = trainiq(config)
results = model.train()

print(f"RMSE: {results['eval_metrics']['rmse']:.2f}")
print(f"R²: {results['eval_metrics']['r2']:.4f}")
```

### Example 3: Image Classification (Dogs vs Cats)

```python
from trainiq import trainiq, trainiqConfig

# Folder structure:
# images/
#   ├── dogs/
#   │   ├── dog1.jpg
#   │   ├── dog2.jpg
#   └── cats/
#       ├── cat1.jpg
#       ├── cat2.jpg

config = trainiqConfig(
    data_path="images/",
    data_type="image",
    model_name="resnet18",
    epochs=50,
    batch_size=32,
    learning_rate=1e-4,
    pretrained=True
)

model = trainiq(config)
results = model.train()

# Export for deployment
paths = model.export(format="onnx")
print(f"Model exported to: {paths['onnx']}")

# Generate API
api_path = model.deploy(output_dir="dog_cat_api")
print(f"API created at: {api_path}")
```

### Example 4: Sentiment Analysis

```python
from trainiq import trainiq, trainiqConfig

config = trainiqConfig(
    data_path="reviews.csv",
    target_column="sentiment",
    data_type="text",
    model_name="distilbert",
    epochs=5,
    batch_size=16,
    learning_rate=2e-5
)

model = trainiq(config)
results = model.train()

# Predict on new reviews
new_reviews = [
    "This product is amazing! Highly recommend.",
    "Terrible quality. Very disappointed."
]
predictions = model.predict(new_reviews)
print(f"Sentiments: {predictions}")
```

### Example 5: Stock Price Forecasting

```python
from trainiq import trainiq, trainiqConfig

config = trainiqConfig(
    data_path="stock_prices.csv",
    data_type="timeseries",
    model_name="lstm",
    epochs=100,
    batch_size=64,
    extra={
        "window": 30,    # Use 30 days to predict
        "horizon": 7     # Predict next 7 days
    }
)

model = trainiq(config)
results = model.train()

# Forecast
future_prices = model.predict(recent_data)
print(f"Forecasted prices: {future_prices}")
```

### Example 6: Custom Architecture

```python
from trainiq import trainiq, trainiqConfig

config = trainiqConfig(
    data_path="data.csv",
    target_column="label",
    layers=[1024, 512, 256, 128, 64],  # Deep network
    activations="gelu",
    dropout=0.5,
    learning_rate=1e-4,
    optimizer="adamw",
    weight_decay=1e-3,
    scheduler="cosine",
    epochs=200,
    early_stopping_patience=20
)

model = trainiq(config)
results = model.train()
```

### Example 7: Ensemble Learning

```python
from trainiq import trainiq, trainiqConfig

config = trainiqConfig(
    data_path="data.csv",
    target_column="label",
    ensemble=True,
    ensemble_top_n=5,  # Ensemble top 5 models
    epochs=50
)

model = trainiq(config)
results = model.train()

print(f"Ensemble accuracy: {results['best_val_acc']:.4f}")
```

### Example 8: WebResearch Integration

```python
from trainiq import research

# Research a topic
results = research(
    query="What are the latest advances in computer vision?",
    llm_provider="huggingface",
    llm_model="google/flan-t5-base",
    max_sources=5,
    research_mode="academic"
)

print(f"Answer:\n{results['answer']}\n")
print(f"Sources:")
for ref in results['references']:
    print(f"  - {ref}")
```


---

## Performance & Optimization

### Hardware Acceleration

#### GPU Training

```python
from trainiq import trainiq, trainiqConfig

config = trainiqConfig(
    data_path="data.csv",
    target_column="label",
    device="cuda",           # Use GPU
    mixed_precision=True,    # Enable AMP for 2x speedup
    num_workers=8,           # Parallel data loading
    pin_memory=True          # Faster GPU transfer
)

model = trainiq(config)
results = model.train()
```

#### Multi-GPU Training

```python
# Use specific GPU
config = trainiqConfig(
    device="cuda:1",  # Use second GPU
    # ... other params
)

# For multi-GPU, wrap model with DataParallel
import torch.nn as nn
model.model = nn.DataParallel(model.model)
```

#### Apple Silicon (MPS)

```python
config = trainiqConfig(
    device="mps",  # Use Apple Metal Performance Shaders
    # ... other params
)
```

### Memory Optimization

#### Reduce Memory Usage

```python
config = trainiqConfig(
    batch_size=16,           # Smaller batch size
    mixed_precision=True,    # Use FP16
    gradient_clip=1.0,       # Prevent gradient explosion
    num_workers=2            # Fewer workers
)
```

#### Gradient Accumulation

```python
# Simulate larger batch size
effective_batch_size = 128
actual_batch_size = 32
accumulation_steps = effective_batch_size // actual_batch_size

config = trainiqConfig(
    batch_size=actual_batch_size,
    # Implement accumulation in custom training loop
)
```

### Training Speed Optimization

#### Fast Training Configuration

```python
config = trainiqConfig(
    data_path="data.csv",
    target_column="label",
    
    # Speed optimizations
    mixed_precision=True,     # 2x faster on GPU
    num_workers=8,            # Parallel data loading
    pin_memory=True,          # Faster GPU transfer
    
    # Efficient model
    model_name="resnet18",    # Smaller than resnet50
    
    # Early stopping
    early_stopping_patience=5,
    
    # Fewer epochs for quick experiments
    epochs=30
)
```

#### Learning Rate Finder

```python
# Automatically find optimal LR
config = trainiqConfig(
    lr_finder=True,  # Saves time on manual tuning
    # ... other params
)
```

### Model Selection Optimization

#### Quick Model Comparison

```python
# ModelSelector uses reduced epochs for fast comparison
config = trainiqConfig(
    data_path="data.csv",
    target_column="label",
    epochs=10,  # Quick evaluation
    model_name=None  # Triggers automatic selection
)

model = trainiq(config)
results = model.train()
```

### Hyperparameter Tuning Optimization

#### Efficient HPO

```python
config = trainiqConfig(
    tune=True,
    tune_trials=20,          # Fewer trials for speed
    tune_timeout=1800,       # 30 minute timeout
    epochs=10,               # Quick evaluation per trial
)
```

#### Pruning Bad Trials

```python
# Optuna automatically prunes unpromising trials
# No additional configuration needed
```

### Inference Optimization

#### Batch Prediction

```python
# Predict in batches for efficiency
import numpy as np

test_data = np.random.randn(1000, 10)
batch_size = 64

predictions = []
for i in range(0, len(test_data), batch_size):
    batch = test_data[i:i+batch_size]
    preds = model.predict(batch)
    predictions.extend(preds)
```

#### ONNX Runtime

```python
# Export to ONNX for faster inference
model.export(format="onnx")

# Use ONNX Runtime for inference
import onnxruntime as ort

session = ort.InferenceSession("trainiq_output/exported/model.onnx")
input_name = session.get_inputs()[0].name
output_name = session.get_outputs()[0].name

predictions = session.run(
    [output_name],
    {input_name: test_data.astype(np.float32)}
)[0]
```

### Best Practices

#### 1. Start Small, Scale Up

```python
# Quick experiment
config = trainiqConfig(
    max_samples=1000,  # Limit dataset size
    epochs=10,
    tune_trials=5
)

# Full training after validation
config = trainiqConfig(
    max_samples=None,  # Use all data
    epochs=100,
    tune_trials=50
)
```

#### 2. Use Pretrained Models

```python
# Transfer learning is faster and more accurate
config = trainiqConfig(
    model_name="resnet50",
    pretrained=True,  # Use ImageNet weights
    learning_rate=1e-4  # Lower LR for fine-tuning
)
```

#### 3. Monitor Training

```python
# Enable verbose logging
config = trainiqConfig(
    verbose=True,
    log_every_n_steps=10
)

# Use TensorBoard
config = trainiqConfig(
    use_tensorboard=True
)

# Then run: tensorboard --logdir trainiq_output
```

#### 4. Save Checkpoints

```python
config = trainiqConfig(
    checkpoint_dir="checkpoints",
    save_best_only=True  # Save only best model
)
```

#### 5. Reproducibility

```python
config = trainiqConfig(
    seed=42  # Fixed seed for reproducibility
)
```

### Performance Benchmarks

#### Tabular Data (10K samples, 50 features)

| Model | Training Time | Accuracy |
|-------|--------------|----------|
| TabularNet | 2 min | 0.89 |
| Random Forest | 30 sec | 0.87 |
| XGBoost | 45 sec | 0.91 |

#### Image Classification (10K images, 10 classes)

| Model | Training Time (GPU) | Accuracy |
|-------|---------------------|----------|
| ResNet18 | 15 min | 0.92 |
| ResNet50 | 30 min | 0.94 |
| EfficientNet-B0 | 20 min | 0.93 |

#### Text Classification (10K samples)

| Model | Training Time (GPU) | Accuracy |
|-------|---------------------|----------|
| TextCNN | 5 min | 0.86 |
| DistilBERT | 20 min | 0.92 |

### Troubleshooting Performance Issues

#### Out of Memory

```python
# Solution 1: Reduce batch size
config = trainiqConfig(batch_size=16)

# Solution 2: Enable mixed precision
config = trainiqConfig(mixed_precision=True)

# Solution 3: Use gradient checkpointing
# (requires custom implementation)
```

#### Slow Training

```python
# Solution 1: Use GPU
config = trainiqConfig(device="cuda")

# Solution 2: Increase workers
config = trainiqConfig(num_workers=8)

# Solution 3: Use smaller model
config = trainiqConfig(model_name="resnet18")  # instead of resnet50
```

#### Poor Convergence

```python
# Solution 1: Use learning rate finder
config = trainiqConfig(lr_finder=True)

# Solution 2: Adjust learning rate
config = trainiqConfig(learning_rate=1e-4)

# Solution 3: Use different optimizer
config = trainiqConfig(optimizer="adamw")

# Solution 4: Add learning rate scheduler
config = trainiqConfig(scheduler="cosine")
```

---

## Troubleshooting

### Common Issues

#### 1. PyTorch DLL Error (Windows)

**Error**: `OSError: [WinError 126] The specified module could not be found`

**Solution**:
```bash
# Reinstall PyTorch with proper dependencies
pip uninstall torch torchvision
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Or for CUDA:
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

#### 2. NumPy Compatibility

**Error**: `AttributeError: module 'numpy' has no attribute 'unicode_'`

**Solution**:
```bash
pip install --upgrade "numpy>=1.21,<2.0" "pyarrow<15.0.0"
pip install --upgrade TrainIQ
```

#### 3. Missing Dependencies

**Error**: `ImportError: No module named 'transformers'`

**Solution**:
```bash
# Install optional dependencies
pip install TrainIQ[text]  # For text models
pip install TrainIQ[research]  # For research engine
pip install TrainIQ[all]  # For all features
```

#### 4. CUDA Out of Memory

**Error**: `RuntimeError: CUDA out of memory`

**Solution**:
```python
config = trainiqConfig(
    batch_size=16,  # Reduce batch size
    mixed_precision=True  # Enable AMP
)
```

#### 5. Research Engine Issues

**Error**: `Failed to generate answer via ollama`

**Solution**:
```bash
# Ensure Ollama is running
ollama serve

# Pull the model
ollama pull llama3

# Or use HuggingFace instead
trainiq research "query" --llm-provider huggingface --llm google/flan-t5-base
```

#### 6. Slow Data Loading

**Solution**:
```python
config = trainiqConfig(
    num_workers=8,  # Increase workers
    pin_memory=True  # Enable for GPU
)
```

#### 7. Model Not Converging

**Solution**:
```python
config = trainiqConfig(
    lr_finder=True,  # Auto-find LR
    scheduler="cosine",  # Add LR scheduler
    gradient_clip=1.0  # Clip gradients
)
```

---

## Contributing

TrainIQ is open-source and welcomes contributions!

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/AmazingFeature`
3. **Commit changes**: `git commit -m 'Add AmazingFeature'`
4. **Push to branch**: `git push origin feature/AmazingFeature`
5. **Open a Pull Request**

### Development Setup

```bash
# Clone repository
git clone https://github.com/jayeshpandey01/TrainIQ.git
cd TrainIQ

# Install in development mode
pip install -e ".[all]"

# Run tests
pytest tests/
```

### Areas for Contribution

- New model architectures
- Additional data modalities (audio, video)
- Performance optimizations
- Documentation improvements
- Bug fixes
- Example notebooks

---

## License

TrainIQ is licensed under the MIT License.

```
MIT License

Copyright (c) 2024 Jayesh Pandey

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## Support & Resources

### Documentation
- **GitHub**: [https://github.com/jayeshpandey01/TrainIQ](https://github.com/jayeshpandey01/TrainIQ)
- **PyPI**: [https://pypi.org/project/TrainIQ/](https://pypi.org/project/TrainIQ/)

### Community
- **Issues**: [GitHub Issues](https://github.com/jayeshpandey01/TrainIQ/issues)
- **Discussions**: [GitHub Discussions](https://github.com/jayeshpandey01/TrainIQ/discussions)

### Citation

If you use TrainIQ in your research, please cite:

```bibtex
@software{trainiq2024,
  author = {Jayesh Pandey},
  title = {TrainIQ: Universal AutoML Library},
  year = {2024},
  url = {https://github.com/jayeshpandey01/TrainIQ},
  version = {0.1.3}
}
```

---

## Acknowledgments

TrainIQ is built on top of excellent open-source libraries:

- **PyTorch**: Deep learning framework
- **scikit-learn**: Machine learning library
- **Optuna**: Hyperparameter optimization
- **FastAPI**: API framework
- **Transformers**: NLP models (HuggingFace)
- **Sentence Transformers**: Semantic embeddings
- **FAISS**: Vector similarity search
- **Ollama**: Local LLM runtime

---

## Changelog

### Version 0.1.3 (Latest)

**New Features**:
- AI Research Assistant with WebResearch Engine
- Dual LLM support: Ollama and HuggingFace
- Multiple research modes (general, academic, documentation, github)
- Flexible HuggingFace model selection

**Bug Fixes**:
- Fixed NumPy 2.0 compatibility issues
- Updated DuckDuckGo search integration
- Improved T5 model support
- Better error handling

### Version 0.1.2

**Features**:
- Model ensembling
- Learning rate finder
- K-fold cross-validation
- Custom callbacks

### Version 0.1.1

**Features**:
- Hyperparameter tuning with Optuna
- Mixed precision training
- ONNX export
- FastAPI deployment

### Version 0.1.0

**Initial Release**:
- Automatic data type detection
- Multi-modal support (tabular, image, text, timeseries)
- Model zoo with pre-built architectures
- Training engine with early stopping
- CLI interface

---

**Made with ❤️ by Jayesh Pandey**

**Star the project on GitHub**: [TrainIQ](https://github.com/jayeshpandey01/TrainIQ) ⭐
