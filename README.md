# 🤖 TrainIQ — Universal trainiq Library

<div align="center">

[![PyPI version](https://badge.fury.io/py/TrainIQ.svg)](https://pypi.org/project/TrainIQ/)
[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**End-to-end ML/DL pipelines with a single call.**

Supports tabular, image, text, and time-series data with automatic model selection, hyperparameter tuning, and deployment.

[Installation](#-installation) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Examples](#-examples)

</div>

---

## ✨ Features

- 🎯 **Automatic Everything**: Data type detection, task detection, model selection, preprocessing
- 🚀 **One-Line Training**: Train state-of-the-art models with a single function call
- 🔧 **Hyperparameter Tuning**: Built-in Optuna integration for automatic optimization
- 📊 **Multiple Data Types**: Tabular, Image, Text, Time-Series support
- 🎨 **Rich Model Zoo**: Neural networks, Random Forest, XGBoost, ResNet, BERT, and more
- 📦 **Easy Deployment**: Export to ONNX/TorchScript + FastAPI scaffold generation
- 💻 **CLI & Python API**: Use from command line or Python scripts
- 🔍 **Comprehensive Metrics**: Automatic evaluation with plots and reports
- 🤖 **AI Research Assistant**: Built-in WebResearch Engine with Ollama & HuggingFace LLM support (NEW in v0.1.3)
- 🌐 **Flexible LLM Integration**: Use any HuggingFace model or local Ollama models for research queries (NEW in v0.1.3)

---

## 🚀 Installation

### Basic Installation
```bash
pip install TrainIQ
```

### With All Features
```bash
pip install TrainIQ[all]
```

### Optional Dependencies
```bash
# For text models (BERT, DistilBERT)
pip install TrainIQ[text]

# For XGBoost
pip install TrainIQ[xgboost]

# For deployment (FastAPI)
pip install TrainIQ[deploy]

# For ONNX export
pip install TrainIQ[onnx]

# For WebResearch Engine with AI assistants (NEW in v0.1.3)
pip install TrainIQ[research]
```

---

## 🆕 What's New in v0.1.3

### AI Research Assistant
TrainIQ now includes a powerful WebResearch Engine that can search the web, scrape content, and answer questions using AI:

- **Dual LLM Support**: Choose between Ollama (local) or HuggingFace (cloud/local) models
- **Flexible Model Selection**: Use any HuggingFace model (T5, BART, GPT, Llama, Mistral, etc.)
- **Smart Web Search**: Automatic web scraping with DuckDuckGo integration
- **Vector Database**: Built-in FAISS for semantic search
- **Multiple Research Modes**: General, academic, documentation, or GitHub-focused searches

```python
from trainiq import research

# Using HuggingFace models
results = research(
    query="What is transfer learning in deep learning?",
    llm_provider="huggingface",
    llm_model="google/flan-t5-base",
    max_sources=5
)

# Using Ollama (local)
results = research(
    query="Explain gradient descent",
    llm_provider="ollama",
    llm_model="llama3"
)

print(results["answer"])
print(results["references"])
```

### Bug Fixes & Improvements
- ✅ Fixed NumPy 2.0 compatibility issues
- ✅ Updated DuckDuckGo search integration
- ✅ Improved T5 model support
- ✅ Better error handling

---

## ⚡ Quick Start

### Python API

```python
from trainiq import trainiq, trainiqConfig

# Configure and train
config = trainiqConfig(
    data_path="data.csv",
    target_column="label",
    epochs=50
)

model = trainiq(config)
results = model.train()

# Make predictions
predictions = model.predict(new_data)

# Export model
model.export(format="onnx")
```

### Command Line Interface

```bash
# Train a model
trainiq train --data data.csv --target label --epochs 50

# With hyperparameter tuning
trainiq train --data data.csv --target label --tune --tune-trials 50

# Check system info
trainiq info

# Get help
trainiq --help
```

---

## 📚 Documentation

### Core Concepts

#### 1. Automatic Data Type Detection
TrainIQ automatically identifies your data modality:
- **Tabular**: CSV, Excel, Parquet, JSON
- **Image**: Folder structure with class subdirectories
- **Text**: CSV with text columns
- **Time-Series**: Sequential data with datetime index

```python
# No need to specify data_type - it's auto-detected!
config = trainiqConfig(data_path="my_data.csv")
```

#### 2. Automatic Task Detection
Identifies whether your problem is:
- Classification (binary or multi-class)
- Regression
- Forecasting (time-series)

```python
# Task is automatically detected from your data
model = trainiq(config)
results = model.train()
```

#### 3. Automatic Model Selection
Compares multiple models and selects the best:
- **Tabular**: MLP, Random Forest, XGBoost
- **Image**: ResNet18, ResNet50, EfficientNet-B0
- **Text**: TextCNN, DistilBERT
- **Time-Series**: LSTM, Transformer

---

## 🔬 AI Research Assistant (NEW in v0.1.3)

### WebResearch Engine

The WebResearch Engine helps you find and synthesize information from the web using AI:

```python
from trainiq import research

# Basic research query
results = research(
    query="What are the latest advances in computer vision?",
    llm_provider="huggingface",
    llm_model="google/flan-t5-base",
    max_sources=5,
    research_mode="academic"
)

print(f"Answer: {results['answer']}")
print(f"Sources: {results['references']}")
```

### Using Different LLM Providers

#### HuggingFace Models (Recommended for flexibility)
```python
# Small, fast model (no token required)
results = research(
    query="Explain neural networks",
    llm_provider="huggingface",
    llm_model="google/flan-t5-small"
)

# Larger model (may require HuggingFace token)
results = research(
    query="What is attention mechanism?",
    llm_provider="huggingface",
    llm_model="meta-llama/Llama-2-7b-chat-hf",
    hf_token="your_huggingface_token"
)
```

#### Ollama (Local, private)
```python
# Requires Ollama running locally
results = research(
    query="What is machine learning?",
    llm_provider="ollama",
    llm_model="llama3"
)
```

### Research Modes

```python
# Academic research (focuses on papers and educational content)
results = research(
    query="Transformer architecture",
    research_mode="academic"
)

# Documentation search (focuses on official docs)
results = research(
    query="PyTorch DataLoader",
    research_mode="documentation"
)

# GitHub search (focuses on code repositories)
results = research(
    query="Best practices for model training",
    research_mode="github"
)

# General search (default)
results = research(
    query="What is deep learning?",
    research_mode="general"
)
```

### CLI Research Commands

```bash
# Using HuggingFace
trainiq research "What is AI?" \
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

# With HuggingFace token for gated models
trainiq research "Latest in NLP" \
  --llm-provider huggingface \
  --llm meta-llama/Llama-2-7b-chat-hf \
  --hf-token your_token_here
```

### Recommended HuggingFace Models

| Model | Size | Speed | Quality | Token Required |
|-------|------|-------|---------|----------------|
| `google/flan-t5-small` | 80M | ⚡⚡⚡ | ⭐⭐ | No |
| `google/flan-t5-base` | 250M | ⚡⚡ | ⭐⭐⭐ | No |
| `microsoft/phi-2` | 2.7B | ⚡ | ⭐⭐⭐⭐ | No |
| `meta-llama/Llama-2-7b-chat-hf` | 7B | ⚡ | ⭐⭐⭐⭐⭐ | Yes |
| `mistralai/Mistral-7B-Instruct-v0.2` | 7B | ⚡ | ⭐⭐⭐⭐⭐ | No |

---

## 🎯 Examples

### Tabular Classification

```python
from trainiq import trainiq, trainiqConfig

config = trainiqConfig(
    data_path="iris.csv",
    target_column="species",
    epochs=50
)

model = trainiq(config)
results = model.train()

print(f"Accuracy: {results['best_val_acc']:.4f}")
```

### Tabular Regression

```python
config = trainiqConfig(
    data_path="housing.csv",
    target_column="price",
    task="regression",
    tune=True,  # Enable hyperparameter tuning
    tune_trials=30
)

model = trainiq(config)
results = model.train()
```

### Image Classification

```python
# Folder structure:
# images/
#   ├── cat/
#   ├── dog/
#   └── bird/

config = trainiqConfig(
    data_path="images/",
    data_type="image",
    model_name="resnet50",
    epochs=100,
    batch_size=64
)

model = trainiq(config)
results = model.train()
model.export(format="onnx")
```

### Text Classification

```python
config = trainiqConfig(
    data_path="reviews.csv",
    target_column="sentiment",
    data_type="text",
    model_name="distilbert",
    epochs=10
)

model = trainiq(config)
results = model.train()
```

### Time-Series Forecasting

```python
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

## 🔧 Configuration Options

### Essential Parameters

```python
config = trainiqConfig(
    # Data
    data_path="data.csv",           # Path to dataset (required)
    target_column="label",          # Target column name
    task="classification",          # "classification", "regression", "forecasting"
    data_type="tabular",            # "tabular", "image", "text", "timeseries"
    
    # Training
    epochs=50,                      # Number of epochs
    batch_size=32,                  # Batch size
    learning_rate=1e-3,             # Learning rate
    optimizer="adam",               # "adam", "adamw", "sgd"
    
    # Model
    model_name="resnet18",          # Specific model to use
    pretrained=True,                # Use pretrained weights
    
    # Hyperparameter Tuning
    tune=True,                      # Enable HPO
    tune_trials=30,                 # Number of trials
    
    # Output
    output_dir="trainiq_output",     # Output directory
    device="cuda",                  # "cpu", "cuda", "mps"
    seed=42                         # Random seed
)
```

### Advanced Features

```python
config = trainiqConfig(
    # Advanced Training
    early_stopping_patience=7,      # Early stopping
    gradient_clip=1.0,              # Gradient clipping
    mixed_precision=True,           # AMP training
    scheduler="cosine",             # LR scheduler
    
    # Model Architecture
    layers=[512, 256, 128],         # Custom layer sizes
    dropout=0.3,                    # Dropout rate
    activations="relu",             # Activation function
    
    # Data Augmentation
    val_split=0.2,                  # Validation split
    cv_folds=5,                     # K-fold CV
    class_weights="auto",           # Handle imbalance
    
    # Advanced Features
    lr_finder=True,                 # Auto-find LR
    ensemble=True,                  # Model ensembling
    ensemble_top_n=3                # Top N models
)
```

---

## 💻 CLI Usage

### Training Commands

```bash
# Basic training
trainiq train --data data.csv --target label

# With custom parameters
trainiq train \
  --data housing.csv \
  --target price \
  --task regression \
  --epochs 100 \
  --batch-size 64 \
  --lr 0.001

# With hyperparameter tuning
trainiq train \
  --data data.csv \
  --target label \
  --tune \
  --tune-trials 50

# Image classification
trainiq train \
  --data images/ \
  --data-type image \
  --model resnet50 \
  --epochs 200

# Export after training
trainiq train \
  --data data.csv \
  --target label \
  --export onnx
```

### Other Commands

```bash
# System information
trainiq info

# Make predictions
trainiq predict \
  --model-path trainiq_output/checkpoints/best_model.pt \
  --data test.csv

# Export model
trainiq export \
  --model-path model.pt \
  --format onnx

# Generate API
trainiq deploy \
  --model-path model.onnx \
  --output my_api/

# AI Research (NEW in v0.1.3)
trainiq research "What is deep learning?" \
  --llm-provider huggingface \
  --llm google/flan-t5-base
```

---

## 📦 Model Zoo

### Tabular Models
| Model | Type | Description |
|-------|------|-------------|
| `tabular_net` | Neural Network | Fully-connected MLP |
| `sklearn_rf` | Random Forest | Fast, interpretable |
| `sklearn_xgb` | XGBoost | High performance |

### Image Models
| Model | Type | Parameters | Description |
|-------|------|------------|-------------|
| `resnet18` | CNN | 11M | Fast, good accuracy |
| `resnet50` | CNN | 25M | Higher accuracy |
| `efficientnet_b0` | CNN | 5M | Efficient |

### Text Models
| Model | Type | Parameters | Description |
|-------|------|------------|-------------|
| `text_cnn` | CNN | <1M | Fast, lightweight |
| `distilbert` | Transformer | 66M | High accuracy |

### Time-Series Models
| Model | Type | Description |
|-------|------|-------------|
| `lstm` | RNN | Handles sequences |
| `transformer_ts` | Transformer | Long-range dependencies |

---

## 🚢 Deployment

### Export Models

```python
# Export to ONNX
paths = model.export(format="onnx")

# Export to TorchScript
paths = model.export(format="torchscript")

# Export to both
paths = model.export(format="both")
```

### Generate FastAPI App

```python
# Generate API scaffold
api_path = model.deploy(output_dir="my_api")

# Then run:
# cd my_api
# pip install -r requirements.txt
# uvicorn app:app --reload
```

### API Endpoints

```bash
# Health check
GET http://localhost:8000/health

# Prediction
POST http://localhost:8000/predict
{
    "data": [[5.1, 3.5, 1.4, 0.2]]
}

# Documentation
GET http://localhost:8000/docs
```

---

## 🔍 Evaluation & Metrics

### Classification Metrics
```python
results = model.train()
metrics = results['eval_metrics']

print(f"Accuracy: {metrics['accuracy']:.4f}")
print(f"F1 Score: {metrics['f1_macro']:.4f}")
print(f"Precision: {metrics['precision_macro']:.4f}")
print(f"Recall: {metrics['recall_macro']:.4f}")
```

### Regression Metrics
```python
print(f"RMSE: {metrics['rmse']:.4f}")
print(f"MAE: {metrics['mae']:.4f}")
print(f"R²: {metrics['r2']:.4f}")
```

### Automatic Visualizations
- Training curves (loss & accuracy)
- Confusion matrix (classification)
- Feature importance (tabular models)

---

## 🐛 Troubleshooting

### Common Issues

#### Out of Memory
```python
config = trainiqConfig(
    batch_size=16,  # Reduce batch size
    mixed_precision=True  # Enable AMP
)
```

#### Slow Training
```python
config = trainiqConfig(
    device="cuda",  # Use GPU
    num_workers=8,  # More data loading workers
    mixed_precision=True
)
```

#### Poor Performance
```python
config = trainiqConfig(
    tune=True,  # Enable hyperparameter tuning
    tune_trials=50
)
```

#### PyTorch DLL Error (Windows)
This is a Windows-specific PyTorch installation issue, not a TrainIQ bug.

**Solution:**
```bash
# Reinstall PyTorch with proper dependencies
pip uninstall torch torchvision
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

Or install CUDA version if you have NVIDIA GPU:
```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

#### NumPy/PyArrow Compatibility (Fixed in v0.1.3)
If you encounter `np.unicode_` errors with older versions:
```bash
pip install --upgrade "numpy>=1.21,<2.0" "pyarrow<15.0.0"
pip install --upgrade TrainIQ
```

#### Research Engine Issues
```bash
# Install research dependencies
pip install "TrainIQ[research]"

# For HuggingFace models, ensure transformers is installed
pip install transformers

# For Ollama, ensure Ollama is running locally
# Download from: https://ollama.ai
```

---

## 📖 Full Documentation

For complete documentation, visit: [Full API Reference](https://github.com/Mickey2004/TrainIQ)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with:
- [PyTorch](https://pytorch.org/) - Deep learning framework
- [Scikit-learn](https://scikit-learn.org/) - Machine learning library
- [Optuna](https://optuna.org/) - Hyperparameter optimization
- [FastAPI](https://fastapi.tiangolo.com/) - API framework
- [Transformers](https://huggingface.co/transformers/) - NLP models
- [Sentence Transformers](https://www.sbert.net/) - Semantic embeddings
- [FAISS](https://github.com/facebookresearch/faiss) - Vector similarity search
- [Ollama](https://ollama.ai/) - Local LLM runtime

---

## 📞 Support

- **PyPI**: [https://pypi.org/project/TrainIQ/](https://pypi.org/project/TrainIQ/)
- **Issues**: [GitHub Issues](https://github.com/Mickey2004/TrainIQ/issues)
- **Documentation**: [GitHub README](https://github.com/Mickey2004/TrainIQ)

---

## 🌟 Star History

If you find TrainIQ useful, please consider giving it a star ⭐

---

<div align="center">

**Made with ❤️ by Mickey2004**

[⬆ Back to Top](#-trainiq--universal-trainiq-library)

</div>
#   t r a i n l q _ w e b s i t e  
 