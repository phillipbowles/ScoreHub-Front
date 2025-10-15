// src/components/game/TimerView.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Play, Pause, ArrowClockwise, CaretUp, CaretDown } from 'phosphor-react-native';
import Svg, { Circle } from 'react-native-svg';

interface TimerViewProps {
  initialDuration: number; // en segundos
  onTimerEnd?: () => void;
}

export const TimerView: React.FC<TimerViewProps> = ({
  initialDuration,
  onTimerEnd,
}) => {
  const [minutes, setMinutes] = useState(Math.floor(initialDuration / 60));
  const [seconds, setSeconds] = useState(initialDuration % 60);
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(initialDuration);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isRunning && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsRunning(false);
            onTimerEnd?.();
          } else {
            setMinutes(m => m - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(s => s - 1);
        }
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, minutes, seconds]);

  const handleReset = () => {
    setIsRunning(false);
    setMinutes(Math.floor(initialDuration / 60));
    setSeconds(initialDuration % 60);
    setTotalSeconds(initialDuration);
  };

  const handlePlayPause = () => {
    if (minutes === 0 && seconds === 0) {
      handleReset();
    }
    setIsRunning(!isRunning);
  };

  const incrementMinutes = () => {
    if (!isRunning) {
      setMinutes(m => Math.min(m + 1, 99));
      setTotalSeconds((minutes + 1) * 60 + seconds);
    }
  };

  const decrementMinutes = () => {
    if (!isRunning && minutes > 0) {
      setMinutes(m => Math.max(m - 1, 0));
      setTotalSeconds(Math.max((minutes - 1) * 60 + seconds, 0));
    }
  };

  const incrementSeconds = () => {
    if (!isRunning) {
      if (seconds === 59) {
        setSeconds(0);
        setMinutes(m => Math.min(m + 1, 99));
      } else {
        setSeconds(s => s + 1);
      }
      setTotalSeconds(minutes * 60 + seconds + 1);
    }
  };

  const decrementSeconds = () => {
    if (!isRunning) {
      if (seconds === 0 && minutes > 0) {
        setSeconds(59);
        setMinutes(m => m - 1);
      } else if (seconds > 0) {
        setSeconds(s => s - 1);
      }
      setTotalSeconds(Math.max(minutes * 60 + seconds - 1, 0));
    }
  };

  // Calcular progreso del círculo
  const currentTotalSeconds = minutes * 60 + seconds;
  const progress = totalSeconds > 0 ? currentTotalSeconds / totalSeconds : 0;
  const strokeDashoffset = 880 - (880 * progress);

  const circleColor = isRunning ? '#10b981' : '#6b7280';

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#1a1d2e',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      {/* Círculo de progreso */}
      <View style={{ position: 'relative', marginBottom: 60 }}>
        <Svg width={320} height={320}>
          {/* Círculo de fondo */}
          <Circle
            cx={160}
            cy={160}
            r={140}
            stroke="#2d3248"
            strokeWidth={12}
            fill="none"
          />
          {/* Círculo de progreso */}
          <Circle
            cx={160}
            cy={160}
            r={140}
            stroke={circleColor}
            strokeWidth={12}
            fill="none"
            strokeDasharray={880}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 160 160)"
          />
        </Svg>

        {/* Tiempo en el centro */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Minutos */}
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            {!isRunning && (
              <TouchableOpacity onPress={incrementMinutes}>
                <CaretUp size={32} color="#fff" weight="bold" />
              </TouchableOpacity>
            )}
            <Text style={{
              fontSize: 72,
              fontWeight: 'bold',
              color: '#10b981',
              marginVertical: -8,
            }}>
              {String(minutes).padStart(2, '0')}
            </Text>
            {!isRunning && (
              <TouchableOpacity onPress={decrementMinutes}>
                <CaretDown size={32} color="#fff" weight="bold" />
              </TouchableOpacity>
            )}
          </View>

          <Text style={{
            fontSize: 48,
            fontWeight: 'bold',
            color: '#10b981',
            marginVertical: -20,
          }}>
            :
          </Text>

          {/* Segundos */}
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            {!isRunning && (
              <TouchableOpacity onPress={incrementSeconds}>
                <CaretUp size={32} color="#fff" weight="bold" />
              </TouchableOpacity>
            )}
            <Text style={{
              fontSize: 72,
              fontWeight: 'bold',
              color: '#10b981',
              marginVertical: -8,
            }}>
              {String(seconds).padStart(2, '0')}
            </Text>
            {!isRunning && (
              <TouchableOpacity onPress={decrementSeconds}>
                <CaretDown size={32} color="#fff" weight="bold" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Botones de control */}
      <View style={{
        flexDirection: 'row',
        gap: 20,
        alignItems: 'center',
      }}>
        {/* Botón Reset */}
        <TouchableOpacity
          onPress={handleReset}
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: '#ef4444',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowClockwise size={32} color="#fff" weight="bold" />
        </TouchableOpacity>

        {/* Botón Play/Pause */}
        <TouchableOpacity
          onPress={handlePlayPause}
          style={{
            width: 90,
            height: 90,
            borderRadius: 45,
            backgroundColor: '#10b981',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isRunning ? (
            <Pause size={40} color="#fff" weight="fill" />
          ) : (
            <Play size={40} color="#fff" weight="fill" />
          )}
        </TouchableOpacity>

        {/* Botón Settings placeholder */}
        <TouchableOpacity
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: '#2d3248',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View style={{ opacity: 0 }}>
            <ArrowClockwise size={32} color="#fff" weight="bold" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};