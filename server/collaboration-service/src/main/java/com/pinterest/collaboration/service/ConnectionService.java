package com.pinterest.collaboration.service;

import com.pinterest.collaboration.dto.ConnectionResponse;
import com.pinterest.collaboration.entity.Connection;
import com.pinterest.collaboration.exception.CustomException;
import com.pinterest.collaboration.repository.ConnectionRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConnectionService {
    private final ConnectionRepository connectionRepository;
    private final ModelMapper modelMapper;

    @Transactional
    public ConnectionResponse followUser(Long followerId, Long followingId) {
        if (followerId.equals(followingId)) {
            throw new CustomException("Cannot follow yourself");
        }
        if (connectionRepository.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            throw new CustomException("Already following this user");
        }
        Connection connection = new Connection();
        connection.setFollowerId(followerId);
        connection.setFollowingId(followingId);
        connection = connectionRepository.save(connection);
        return modelMapper.map(connection, ConnectionResponse.class);
    }

    @Transactional
    public void unfollowUser(Long followerId, Long followingId) {
        Connection connection = connectionRepository
                .findByFollowerIdAndFollowingId(followerId, followingId)
                .orElseThrow(() -> new CustomException("Connection not found"));
        connectionRepository.delete(connection);
    }

    @Transactional(readOnly = true)
    public List<ConnectionResponse> getFollowers(Long userId) {
        List<Connection> connections = connectionRepository.findByFollowingId(userId);
        return connections.stream()
                .map(conn -> modelMapper.map(conn, ConnectionResponse.class))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ConnectionResponse> getFollowing(Long userId) {
        List<Connection> connections = connectionRepository.findByFollowerId(userId);
        return connections.stream()
                .map(conn -> modelMapper.map(conn, ConnectionResponse.class))
                .collect(Collectors.toList());
    }
}




